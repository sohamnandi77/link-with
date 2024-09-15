import { db } from "@/server/db";

export const getUserById = async (id?: string) => {
  try {
    if (!id) return null;
    const user = await db.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    return user;
  } catch {
    return null;
  }
};
