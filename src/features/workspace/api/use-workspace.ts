import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/functions/fetcher";
import { type LinkSchema } from "@/schema/links";
import { type z } from "zod";

export const workspaceOptions = (slug: string) =>
  queryOptions({
    queryKey: ["workspace", slug],
    queryFn: () =>
      fetcher<z.infer<typeof LinkSchema>[]>(`/api/links?workspaceSlug=${slug}`),
  });

export const useWorkspace = (slug: string) => {
  return useQuery(workspaceOptions(slug));
};
