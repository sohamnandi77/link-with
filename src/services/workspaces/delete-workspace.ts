import { type WorkspaceProps } from "@/lib/types";
import { db } from "@/server/db";

export async function deleteWorkspace(
  workspace: Pick<WorkspaceProps, "id" | "slug" | "logo">,
) {
  const response = await db.workspaceUsers.deleteMany({
    where: {
      workspaceId: workspace.id,
    },
  });

  await Promise.all([
    // delete the workspace
    db.workspace.delete({
      where: {
        slug: workspace.slug,
      },
    }),
    db.user.updateMany({
      where: {
        defaultWorkspace: workspace.slug,
      },
      data: {
        defaultWorkspace: null,
      },
    }),
  ]);

  return response;
}
