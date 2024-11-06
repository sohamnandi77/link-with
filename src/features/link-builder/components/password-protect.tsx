import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useToggle from "@/hooks/use-toggle";
import { Eye } from "@/icons/eye";
import { EyeSlash } from "@/icons/eye-slash";
import { nanoid } from "@/lib/vendors/nanoid";
import { type createLinkBodySchema } from "@/schema/links";
import { Shuffle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";

const PasswordProtect = () => {
  const { control, watch, setValue } =
    useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { password } = watch();
  const [showPassword, togglePassword] = useToggle(false);

  return (
    <div className="space-y-3">
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <div>Password</div>
              <div className="ml-auto">
                <Button variant="ghost" type="button" onClick={togglePassword}>
                  {showPassword ? (
                    <EyeSlash className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setValue("password", nanoid(24), { shouldDirty: true });
                  }}
                >
                  <Shuffle className="size-4" />
                </Button>
              </div>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
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
