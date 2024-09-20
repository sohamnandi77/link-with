import { edgeDb } from "@/server/edge-db";

export const getUserByEmailEdge = async (email?: string) => {
  try {
    if (!email) return null;
    const user = await edgeDb.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};
