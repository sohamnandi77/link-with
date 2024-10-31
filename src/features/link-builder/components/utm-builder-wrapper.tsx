import {
  constructURLFromUTMParams,
  getParamsFromURL,
  isValidUrl,
} from "@/lib/functions/urls";
import { type createLinkBodySchema } from "@/schema/links";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { UTMBuilder } from "./utm-builder";

const UTMBuilderWrapper = () => {
  const { watch, setValue } =
    useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { originalLink } = watch();
  const enabledParams = useMemo(
    () => getParamsFromURL(originalLink),
    [originalLink],
  );

  return (
    <div>
      <UTMBuilder
        values={enabledParams}
        onChange={(key, value) => {
          if (key !== "utmReferral")
            setValue(key, value, { shouldDirty: true });

          setValue(
            "originalLink",
            constructURLFromUTMParams(originalLink, {
              ...enabledParams,
              [key]: value,
            }),
            { shouldDirty: true },
          );
        }}
        disabledTooltip={
          isValidUrl(originalLink)
            ? undefined
            : "Enter a destination URL to add UTM parameters"
        }
        autoFocus
      />
      {isValidUrl(originalLink) && (
        <div className="mt-4 grid gap-y-1">
          <span className="block text-sm font-medium text-gray-700">
            URL Preview
          </span>
          <div className="mt-2 overflow-y-scroll break-words rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 font-mono text-xs text-gray-500">
            {originalLink}
          </div>
        </div>
      )}
    </div>
  );
};

export default UTMBuilderWrapper;
