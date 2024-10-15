import { generateWorkspaceSlug } from "@/lib/functions/generate-workspace-slug";
import { nanoid } from "@/lib/vendors/nanoid";
import { db } from "@/server/db";

export async function createDefaultWorkspace(userId?: string) {
  try {
    if (!userId) return null;

    const slug = generateWorkspaceSlug(userId);

    const [workspace] = await db.$transaction([
      db.workspace.create({
        data: {
          name: "Personal",
          slug,
          inviteCode: nanoid(24),
          createdBy: userId,
          updatedBy: userId,
          users: {
            create: {
              userId: userId,
              role: "ADMIN",
            },
          },
        },
      }),
      db.user.update({
        where: { id: userId },
        data: { defaultWorkspace: slug },
      }),
    ]);

    return workspace;
  } catch (error) {
    console.error(error);
    return null;
  }
}
