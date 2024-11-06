import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/functions/fetcher";
import { type PlanProps } from "@/lib/types";

type WorkspaceWithMembers = {
  name: string;
  id: string;
  slug: string;
  logo: string | null;
  plan: PlanProps;
  _count: {
    links: number;
    users: number;
  };
  users: {
    user: {
      name: string | null;
      id: string;
      image: string | null;
    };
  }[];
};

export const workspaceQueryOptions = queryOptions({
  queryKey: ["workspaces"],
  queryFn: () => fetcher<WorkspaceWithMembers[]>(`/api/workspaces`),
});

export const useWorkspaces = () => {
  return useSuspenseQuery(workspaceQueryOptions);
};
