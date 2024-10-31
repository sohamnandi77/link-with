import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { type createLinkBodySchema } from "@/schema/links";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";

const SearchEngineIndexing = () => {
  const { control } = useFormContext<z.infer<typeof createLinkBodySchema>>();

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <FormField
          control={control}
          name="shouldIndex"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>
                  Search Engine Indexing
                  <FormDescription>
                    Enable this to allow search engines to index your link
                  </FormDescription>
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SearchEngineIndexing;
