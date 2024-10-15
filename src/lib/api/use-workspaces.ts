import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/functions/fetcher";
import { type WorkspaceProps } from "@/lib/types";

export const workspaceOptions = queryOptions({
  queryKey: ["workspaces"],
  queryFn: () => fetcher<WorkspaceProps>(`/api/workspaces`),
});

export const useWorkspace = () => {
  return useQuery(workspaceOptions);
};
