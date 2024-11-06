import { fetcher } from "@/lib/functions/fetcher";
import { type LinkSchema } from "@/schema/links";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { type z } from "zod";

export const linkOptions = (linkId: string, workspaceSlug: string) =>
  queryOptions({
    queryKey: ["link", workspaceSlug, linkId],
    queryFn: () =>
      fetcher<z.infer<typeof LinkSchema>>(
        `/api/links/${linkId}?workspaceSlug=${workspaceSlug}`,
      ),
  });

export const useLinkDetails = (linkId: string, slug: string) => {
  return useSuspenseQuery(linkOptions(linkId, slug));
};
