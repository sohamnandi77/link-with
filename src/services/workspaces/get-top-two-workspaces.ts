import { type WorkspaceWithUsers } from "@/lib/types";
import { db } from "@/server/db";

export const getTop2Workspaces = async (
  userId: string,
  defaultWorkspaceSlug: string,
  selectedWorkspace: WorkspaceWithUsers,
) => {
  try {
    // Determine if the selected workspace is the default workspace
    const isDefaultSelected =
      defaultWorkspaceSlug && selectedWorkspace?.slug === defaultWorkspaceSlug;

    // Define the query for an additional workspace
    const otherWorkspace = await db.workspace.findFirst({
      where: {
        AND: [
          {
            users: {
              some: { userId }, // Filter to workspaces the user is a member of
            },
          },
          {
            slug: isDefaultSelected
              ? { not: defaultWorkspaceSlug } // Exclude default if it's selected
              : defaultWorkspaceSlug, // Otherwise, include default
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        plan: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    // Return selected workspace and other workspace if found
    return otherWorkspace?.id
      ? { selectedWorkspace, workspaces: [selectedWorkspace, otherWorkspace] }
      : { selectedWorkspace, workspaces: [selectedWorkspace] };
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw error;
  }
};
