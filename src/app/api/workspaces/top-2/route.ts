import { withWorkspace } from "@/lib/auth/with-workspace";
import { getTop2Workspaces } from "@/services/workspaces/get-top-two-workspaces";

// GET /api/workspaces/top-2 – get the top 2 workspaces
export const GET = withWorkspace(async ({ session, workspace }) => {
  const workspaces = await getTop2Workspaces(
    session?.user.id ?? "",
    session?.user.defaultWorkspace ?? "",
    workspace,
  );

  return Response.json({
    selectedWorkspace: {
      ...workspaces.selectedWorkspace,
      id: `ws_${workspaces.selectedWorkspace.id}`,
    },
    workspaces: workspaces.workspaces?.map((workspace) => ({
      ...workspace,
      id: `ws_${workspace.id}`,
    })),
  });
});
