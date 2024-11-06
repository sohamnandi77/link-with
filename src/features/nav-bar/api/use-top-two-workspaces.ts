import { useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/functions/fetcher";
import { type PlanProps, type WorkspaceWithUsers } from "@/lib/types";

type Top2Workspaces = {
  selectedWorkspace: WorkspaceWithUsers;
  workspaces: {
    name: string;
    id: string;
    slug: string;
    logo: string | null;
    plan: PlanProps;
    _count: {
      users: number;
    };
  }[];
};

export const useTop2Workspaces = (slug: string) => {
  return useQuery({
    queryKey: ["workspaces", slug],
    queryFn: () =>
      fetcher<Top2Workspaces>(`/api/workspaces/top-2?workspaceSlug=${slug}`),
  });
};
