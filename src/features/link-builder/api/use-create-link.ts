import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { fetcher } from "@/lib/functions/fetcher";
import { type LinkSchema, type createLinkBodySchema } from "@/schema/links";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { type z } from "zod";

export const useCreateLink = () => {
  const params = useParams();
  const { copyToClipboard } = useCopyToClipboard();
  const router = useRouter();

  return useMutation({
    mutationKey: ["createLink"],
    mutationFn: async (values: z.infer<typeof createLinkBodySchema>) => {
      return fetcher<z.infer<typeof LinkSchema>>(
        `/api/links?workspaceSlug=${params?.slug as string}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, domain: "lk.linkyatri.com" }),
        },
      );
    },
    onSuccess: async (data) => {
      router.push(`/${params?.slug as string}/link-details/${data.id}`);
      await copyToClipboard(data.shortLink);
      toast.success("Copied short link to clipboard!");
    },
  });
};
