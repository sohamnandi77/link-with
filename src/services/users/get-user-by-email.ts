import { db } from "@/server/db";

export const getUserByEmail = async (email?: string) => {
  try {
    if (!email) return null;
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};
