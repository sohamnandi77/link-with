import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { TimePicker } from "@/components/widgets/time-picker/time-picker";
import { cn } from "@/lib/utils";
import { type createLinkBodySchema } from "@/schema/links";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";

const LinkExpiration = () => {
  const { control } = useFormContext<z.infer<typeof createLinkBodySchema>>();

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <FormField
          control={control}
          name="expiredLinkByDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Date and Time</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePicker
                      setDate={field.onChange}
                      date={field.value ? new Date(field.value) : undefined}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-3">
        <FormField
          control={control}
          name="expiredLinkByClicks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type="number"
                  placeholder="Enter the number of clicks"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-3">
        <FormField
          control={control}
          name="expiredUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  value={field.value ?? ""}
                  placeholder="Enter the URL to redirect after expiration"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LinkExpiration;
