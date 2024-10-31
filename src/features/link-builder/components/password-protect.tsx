import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type createLinkBodySchema } from "@/schema/links";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";

const PasswordProtect = () => {
  const { control, watch, setValue } =
    useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { password } = watch();

  return (
    <div className="space-y-3">
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder="Enter the password for your link"
                value={password ?? ""}
                onChange={(e) => {
                  setValue("password", e.target.value, { shouldDirty: true });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PasswordProtect;
