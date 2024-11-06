import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingCircle } from "@/icons/loading-circle";
import { type createLinkBodySchema } from "@/schema/links";
import { Shuffle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { useRandomKey } from "../api/use-random-key";

const Keyword = () => {
  const { control } = useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { mutate, isPending } = useRandomKey();

  return (
    <FormField
      control={control}
      name="keyword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            <span>Short Link</span>
            <Button
              type="button"
              variant="ghost"
              // FIXME
              onClick={() => mutate({ domain: "link", workspaceId: "1" })}
            >
              {isPending ? <LoadingCircle /> : <Shuffle className="h-3 w-3" />}
            </Button>
          </FormLabel>
          <FormControl>
            <Input placeholder="Paste your link" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Keyword;
