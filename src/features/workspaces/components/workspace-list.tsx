"use client";

import { useWorkspaces } from "@/features/workspaces/api/use-workspaces";
import { useSession } from "next-auth/react";
import WorkspaceCard from "./workspace-card";

const WorkspacesList = () => {
  const { data: workspaces } = useWorkspaces();
  const { data: session } = useSession();

  return (
    <>
      {workspaces?.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          id={workspace.id}
          name={workspace.name}
          plan={workspace.plan}
          logo={workspace.logo}
          slug={workspace.slug}
          usersCount={workspace._count.users}
          linksCount={workspace._count.links}
          users={workspace.users.map((user) => user.user)}
          isDefault={workspace.id === session?.user.defaultWorkspace}
        />
      ))}
    </>
  );
};

export default WorkspacesList;
