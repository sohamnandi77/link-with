import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from "next-auth";
import { type Adapter, type AdapterUser } from "next-auth/adapters";

import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import {
  exceededLoginAttemptsThreshold,
  incrementLoginAttempts,
  resetLoginAttempts,
} from "@/lib/auth/lock-account";
import { validatePassword } from "@/lib/auth/password";
import { generateWorkspaceSlug } from "@/lib/functions/generate-workspace-slug";
import { type UserProps } from "@/lib/types";
import { ratelimit } from "@/lib/upstash";
import { nanoid } from "@/lib/vendors/nanoid";
import { LoginSchema } from "@/schema/auth";
import { getUserByAccount } from "@/services/users/get-user-by-account";
import { getUserByEmail } from "@/services/users/get-user-by-email";
import { getUserById } from "@/services/users/get-user-by-id";
import { linkAccount } from "@/services/users/link-account";
import { createDefaultWorkspace } from "@/services/workspaces/create-default-workspsce";
import { OAuth2Client } from "google-auth-library";
import { type JWT } from "next-auth/jwt";
import { db } from "./db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string;
      lockedAt?: Date;
      createdAt: Date;
      updatedAt: Date;
      defaultWorkspace?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    user: User | UserProps | AdapterUser;
  }
}

// const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

const googleAuthClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false; // Prevent sign in without email or blacklisted email

      if ("lockedAt" in user && user?.lockedAt) {
        return false;
      }

      if (account?.provider !== "credentials") {
        return true;
      }

      return true;
    },
    async session({ token, session }) {
      if (session.user && token.user) {
        const user = token.user as UserProps;
        session.user = {
          ...session.user,
          ...user,
          id: token.sub ?? session.user.id,
        };
      }

      return session;
    },
    async jwt({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user: User | AdapterUser | UserProps;
      trigger?: "signIn" | "update" | "signUp";
    }) {
      if (!token.sub) return token;

      if (user) {
        token.user = user;
      }

      // refresh the user's data if they update their name / email
      if (trigger === "update") {
        const refreshedUser = await getUserById(token.sub);
        if (refreshedUser) {
          token.user = {
            ...refreshedUser,
            provider: "credentials",
          };
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  // cookies: {
  //   sessionToken: {
  //     name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
  //       domain: VERCEL_DEPLOYMENT
  //         ? `.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
  //         : undefined,
  //       secure: VERCEL_DEPLOYMENT,
  //     },
  //   },
  // },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "credentials",
      type: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { success } = await ratelimit(5, "1 m").limit(
            `login-attempts:${email}`,
          );

          if (!success) {
            throw new Error("too-many-login-attempts");
          }

          const user = await getUserByEmail(email);
          if (!user?.password) throw new Error("invalid-credentials");

          if (exceededLoginAttemptsThreshold(user)) {
            throw new Error("exceeded-login-attempts");
          }

          const passwordMatch = await validatePassword({
            password,
            passwordHash: user.password,
          });

          if (!passwordMatch) {
            const exceededLoginAttempts = exceededLoginAttemptsThreshold(
              await incrementLoginAttempts(user),
            );

            if (exceededLoginAttempts) {
              throw new Error("exceeded-login-attempts");
            } else {
              throw new Error("invalid-credentials");
            }
          }

          // Reset invalid login attempts
          await resetLoginAttempts(user);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }

        throw new Error("invalid-credentials");
      },
    }),
    CredentialsProvider({
      // The id of this credential provider. It's important to give an id because, in frontend we don't want to
      // show anything about this provider in a normal login flow
      id: "googleonetap",
      // A readable name
      name: "google-one-tap",
      // This field define what parameter we expect from the FE and what's its name. In this case "credential"
      // This field will contain the token generated by google
      credentials: {
        credential: { type: "text" },
      },
      // This where all the logic goes
      authorize: async (credentials) => {
        // These next few lines are simply the recommended way to use the Google Auth Javascript API as seen in the Google Auth docs
        // What is going to happen is that t he Google One Tap UI will make an API call to Google and return a token associated with the user account
        // This token is then passed to the authorize function and used to retrieve the customer information (payload).
        // If this doesn't make sense yet, come back to it after having seen the custom hook.

        // The token given by google and provided from the frontend
        const token = credentials!.credential;
        // We use the google library to exchange the token with some information about the user
        const ticket = await googleAuthClient.verifyIdToken({
          // The token received from the interface
          idToken: token,
          // This is the google ID of your application
          audience: env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload(); // This is the user

        if (!payload) {
          throw new Error("Cannot extract payload from signin token");
        }

        const {
          email,
          sub,
          given_name,
          family_name,
          email_verified,
          picture: image,
        } = payload;

        if (!email) {
          throw new Error("Email not available");
        }

        // At this point we have deconstructed the payload and we have all the user's info at our disposal.
        // So first we're going to do a check to see if we already have this user in our DB using the email as identifier.
        let user = await getUserByEmail(email);

        // If there's no user, we need to create it
        if (!user) {
          user = await db.user.create({
            data: {
              id: sub,
              name: [given_name, family_name].join(" "),
              email,
              image,
              emailVerified: email_verified ? new Date() : null,
            },
          });
        }

        // The user may already exist, but maybe it signed up with a different provider. With the next few lines of code
        // we check if the user already had a Google account associated, and if not we create one.
        const account =
          user &&
          (await getUserByAccount({
            provider: "google",
            providerAccountId: sub,
          }));

        if (!account && user) {
          console.log("creating and linking account");
          await linkAccount({
            userId: user.id,
            provider: "google",
            providerAccountId: sub,
            type: "credentials",
            access_token: null,
            refresh_token: null,
          });
        }
        return user;
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      const slug = generateWorkspaceSlug(user?.id);
      const inviteCode = nanoid(24);
      // create a default workspace for the user
      await createDefaultWorkspace(user?.id, slug, inviteCode);
    },
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === "development",
};
