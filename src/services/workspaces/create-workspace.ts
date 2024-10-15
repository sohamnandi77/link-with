import { generateWorkspaceSlug } from "@/lib/functions/generate-workspace-slug";
import { nanoid } from "@/lib/vendors/nanoid";
import { db } from "@/server/db";

export async function createtWorkspace(userId?: string) {
  try {
    if (!userId) return null;

    const slug = generateWorkspaceSlug(userId);
    const inviteCode = nanoid(24);

    // Create a default workspace for the user
    const workspace = await db.workspace.create({
      data: {
        name: "Personal",
        slug,
        inviteCode: inviteCode,
        createdBy: userId,
        updatedBy: userId,
        users: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
      },
    });

    return workspace;
  } catch (error) {
    console.error(error);
    return null;
  }
}
