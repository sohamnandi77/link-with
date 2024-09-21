import { db } from "@/server/db";

export const getUserByAccount = async ({
  provider,
  providerAccountId,
}: {
  provider: string;
  providerAccountId: string;
}) => {
  try {
    const user = await db.user.findFirst({
      where: {
        accounts: {
          some: {
            provider,
            providerAccountId,
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
};
