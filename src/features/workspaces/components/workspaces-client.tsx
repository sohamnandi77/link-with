import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { getQueryClient } from "@/lib/api/query-client";
import { workspacesOptions } from "@/lib/api/use-workspaces";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import CreateWorkspaceCard from "./create-workspace-card";
import WorkspacesList from "./workspace-list";

const WorkspacesClient = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(workspacesOptions);

  return (
    <MaxWidthWrapper className="my-10">
      <div className="rounded-xl bg-white p-6">
        <div className="flex flex-col">
          <h1 className="text-2xl">My Workspaces</h1>
          <p className="text-sm text-gray-500">
            Select a workspace or create new
          </p>
        </div>
        <div className="my-10 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <CreateWorkspaceCard>
              <div className="flex h-[440px] w-[292px] items-center justify-center rounded-xl border border-dashed border-[#E9D5FF] bg-[#FAF5FF]">
                <div className="flex flex-col items-center justify-center space-y-7">
                  <Plus className="size-12" />
                  <span className="font-semibold">Add Workspace</span>
                </div>
              </div>
            </CreateWorkspaceCard>
            <WorkspacesList />
          </HydrationBoundary>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default WorkspacesClient;
