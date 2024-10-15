import { db } from "@/server/db";

export const getWorkspacesWithMemberDetails = async (userId: string) => {
  try {
    return await db.workspace.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        plan: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          take: 3,
        },
        _count: {
          select: {
            users: true,
            links: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("Error fetching workspaces:", error);
    throw error;
  }
};
