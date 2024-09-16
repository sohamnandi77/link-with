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
import { nanoid } from "@/lib/vendors/nanoid";
import { LoginSchema } from "@/schema/auth";
import { getUserByEmail } from "@/services/users/get-user-by-email";
import { getUserById } from "@/services/users/get-user-by-id";
import { createDefaultWorkspace } from "@/services/workspaces/create-default-workspsce";
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
  ],
  events: {
    async createUser({ user }) {
      const slug = generateWorkspaceSlug(user?.id);
      const inviteCode = nanoid(24);
      // create a default workspace for the user
      await createDefaultWorkspace(user?.id, slug, inviteCode);
    },
  },
};
