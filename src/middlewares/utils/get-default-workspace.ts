import { type UserProps } from "@/lib/types";
import { db } from "@/server/db";

export async function getDefaultWorkspace(
  user: Pick<UserProps, "id" | "defaultWorkspace">,
) {
  let defaultWorkspace = user?.defaultWorkspace;

  if (!defaultWorkspace) {
    const refreshedUser = await db.user.findUnique({
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
