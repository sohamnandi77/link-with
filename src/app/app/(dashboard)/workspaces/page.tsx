import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { getSession } from "@/lib/auth/utils";
import { getWorkspacesWithMemberDetails } from "@/services/workspaces/get-workspaces-with-members-details";
import CreateWorkspaceCard from "./create-workspace-card";
import WorkspaceCard from "./workspace-card";

export default async function Workspaces() {
  const session = await getSession();
  const workspaces = await getWorkspacesWithMemberDetails(session.user.id);

  return (
    <>
      <MaxWidthWrapper className="my-14">
        <div className="rounded-xl bg-white p-6">
          <div className="flex flex-col">
            <h1 className="text-2xl">My Workspaces</h1>
            <p className="text-sm text-gray-500">
              Select a workspace or create new
            </p>
          </div>
          <div className="my-10 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
            <CreateWorkspaceCard />
            {workspaces?.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                id={workspace.id}
                name={workspace.name}
                plan={workspace.plan}
                usersCount={workspace._count.users}
                linksCount={workspace._count.links}
                users={workspace.users.map((user) => user.user)}
              />
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
