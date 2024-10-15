import { db } from "@/server/db";

export const getAllWorkspaces = async (userId: string) => {
  try {
    const workspaces = await db.workspace.findMany({
      where: {
        users: { some: { userId } },
      },
      include: {
        users: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });

    return workspaces;
  } catch (error) {
    console.log("Error fetching workspaces:", error);
    throw error;
  }
};
