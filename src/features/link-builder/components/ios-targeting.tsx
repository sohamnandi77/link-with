import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  constructURLFromUTMParams,
  getParamsFromURL,
  isValidUrl,
} from "@/lib/functions/urls";
import { type createLinkBodySchema } from "@/schema/links";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { UTM_PARAMETERS } from "./utm-builder";

const DeviceTargeting = () => {
  const { control, watch, setValue } =
    useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { originalLink } = watch();

  // Get UTM parameters from the parent URL that need to be added on blur
  const getNewParams = useCallback(
    (targetURL: string): Record<string, string> | null => {
      if (!targetURL?.trim() || !isValidUrl(targetURL)) return null;

      const parentParams = getParamsFromURL(originalLink);
      const targetParams = getParamsFromURL(targetURL);

      const newParams = UTM_PARAMETERS.filter(
        ({ key }) => parentParams?.[key] && !targetParams?.[key],
      ).map(({ key }) => [key, parentParams[key]]);

      return newParams.length
        ? (Object.fromEntries(newParams) as Record<string, string>)
        : null;
    },
    [originalLink],
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <FormField
          control={control}
          name="ios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>iOS Targeting</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Paste your iOS targeting URL"
                  onBlur={(e) => {
                    const newParams = getNewParams(e.target.value);

                    if (newParams)
                      setValue(
                        "ios",
                        constructURLFromUTMParams(e.target.value, newParams),
                        { shouldDirty: true },
                      );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div className="min-w-0 grow">
          <DisabledTooltipWrapper disabledTooltip={disabledTooltip}>
            <Input
              id={`${id}-${key}`}
              ref={idx === 0 ? inputRef : undefined}
              placeholder={placeholder}
              disabled={disabled ?? Boolean(disabledTooltip)}
              className="size-full rounded-l-none border border-gray-300 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 disabled:cursor-not-allowed sm:text-sm"
              value={values[key] ?? ""}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </DisabledTooltipWrapper>
        </div> */}
      </div>
      <div className="space-y-3">
        <FormField
          control={control}
          name="android"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Android Targeting</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Paste your Android targeting URL"
                  onBlur={(e) => {
                    const newParams = getNewParams(e.target.value);

                    if (newParams)
                      setValue(
                        "android",
                        constructURLFromUTMParams(e.target.value, newParams),
                        { shouldDirty: true },
                      );
                  }}
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

export default DeviceTargeting;
