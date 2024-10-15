import { db } from "@/server/db";

export const getTop2Workspaces = async (userId: string) => {
  try {
    const workspaces = await db.workspace.findMany({
      where: {
        users: { some: { userId } },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        plan: true,
      },
    });

    return workspaces;
  } catch (error) {
    console.log("Error fetching workspaces:", error);
    throw error;
  }
};
