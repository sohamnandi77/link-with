import { db } from "@/server/db";

export const linkAccount = async ({
  userId,
  provider,
  providerAccountId,
  type,
  access_token,
  refresh_token,
}: {
  userId: string;
  provider: "google" | "github" | "credentials";
  providerAccountId: string;
  type: "oauth" | "credentials";
  access_token: string | null;
  refresh_token: string | null;
}) => {
  try {
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        accounts: {
          create: {
            provider,
            providerAccountId,
            type,
            access_token,
            refresh_token,
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
};
