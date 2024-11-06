import { fetcher } from "@/lib/functions/fetcher";
import { useMutation } from "@tanstack/react-query";
import { type randomKeyInput } from "../types";

export const useRandomKey = () => {
  return useMutation({
    mutationKey: ["randomKey"],
    mutationFn: async ({ domain, workspaceId }: randomKeyInput) => {
      return fetcher<string>(
        `/api/links/random?domain=${domain}&workspaceId=${workspaceId}`,
      );
    },
  });
};
