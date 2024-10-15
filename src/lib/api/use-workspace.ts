import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/functions/fetcher";
import { type WorkspaceProps } from "@/lib/types";

export const workspaceOptions = (slug: string) =>
  queryOptions({
    queryKey: ["workspace", slug],
    queryFn: () => fetcher<WorkspaceProps>(`/workspaces/${slug}`),
  });

export const useWorkspace = (slug: string) => {
  return useQuery(workspaceOptions(slug));
};
