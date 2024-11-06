import useToggle from "@/hooks/use-toggle";
import { fetcher } from "@/lib/functions/fetcher";
import { type createWorkspaceSchema } from "@/schema/workspaces";
import { type ApiError } from "@/services/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { type UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const useAddWorkspace = (
  reset: UseFormReset<z.infer<typeof createWorkspaceSchema>>,
) => {
  const { update } = useSession();
  const queryClient = useQueryClient();
  const [showModal, toggleModal] = useToggle();

  const mutationResults = useMutation({
    mutationKey: ["addWorkspace"],
    mutationFn: (values: z.infer<typeof createWorkspaceSchema>) =>
      fetcher<z.infer<typeof createWorkspaceSchema>>("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }),
    onSuccess: async (data) => {
      await update();
      await delay(500);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["workspaces", data.slug],
        }),
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
      ]);
      if (data) toast.success("Workspace created successfully");
    },
    onSettled: () => {
      toggleModal();
      if (reset) reset();
    },
    onError: (error) => {
      const parseError = (JSON.parse(error?.message) as { error: ApiError })
        .error;
      if (parseError.code === "LIMIT_EXCEEDED") {
        toast.error(parseError.message);
      }
    },
  });

  return { showModal, toggleModal, ...mutationResults };
};
