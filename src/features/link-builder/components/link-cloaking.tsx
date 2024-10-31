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

const LinkCloaking = () => {
  const { control, watch } =
    useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { originalLink } = watch();

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <FormField
          control={control}
          name="cloaked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>
                  Cloak Link
                  <FormDescription>
                    Enable this to cloak your link
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
      {Boolean(originalLink) && (
        <div className="space-y-3">
          <div className="grid gap-2">
            <div className="h-[250px] w-[444px] overflow-hidden rounded-lg border border-gray-200">
              <iframe
                src={originalLink}
                style={{
                  zoom: 0.5,
                }}
                className="h-[500px] w-[888px]"
              />
            </div>
            <p>Your link will be successfully cloaked.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkCloaking;
