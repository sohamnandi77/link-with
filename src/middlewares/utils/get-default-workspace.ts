import { type UserProps } from "@/lib/types";
import { edgeDb } from "@/server/edge-db";

export async function getDefaultWorkspace(user: UserProps) {
  let defaultWorkspace = user?.defaultWorkspace;

  if (!defaultWorkspace) {
    const refreshedUser = await edgeDb.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        defaultWorkspace: true,
        workspaces: {
          select: {
            workspace: {
              select: {
                slug: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    defaultWorkspace =
      refreshedUser?.defaultWorkspace ??
      refreshedUser?.workspaces[0]?.workspace?.slug ??
      undefined;
  }

  return defaultWorkspace;
}
