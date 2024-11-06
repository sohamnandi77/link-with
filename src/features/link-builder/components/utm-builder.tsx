"use client";

import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { DisabledTooltipWrapper } from "@/components/widgets/disabled-tooltip-wrapper";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Flag6 } from "@/icons/flag6";
import { Gift } from "@/icons/gift";
import { GlobePointer } from "@/icons/globe-pointer";
import { InputSearch } from "@/icons/input-search";
import { Page2 } from "@/icons/page2";
import { SatelliteDish } from "@/icons/satellite-dish";
import { cn } from "@/lib/utils";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

export const UTM_PARAMETERS = [
  {
    key: "utmSource",
    icon: GlobePointer,
    label: "Source",
    placeholder: "google",
    description: "Where the traffic is coming from",
  },
  {
    key: "utmMedium",
    icon: SatelliteDish,
    label: "Medium",
    placeholder: "cpc",
    description: "How the traffic is coming",
  },
  {
    key: "utmCampaign",
    icon: Flag6,
    label: "Campaign",
    placeholder: "summer_sale",
    description: "The name of the campaign",
  },
  {
    key: "utmTerm",
    icon: InputSearch,
    label: "Term",
    placeholder: "running shoes",
    description: "The term of the campaign",
  },
  {
    key: "utmContent",
    icon: Page2,
    label: "Content",
    placeholder: "logolink",
    description: "The content of the campaign",
  },
  {
    key: "utmReferral",
    icon: Gift,
    label: "Referral",
    placeholder: "yoursite.com",
    description: "The referral of the campaign",
  },
] as const;

type UTMParameter = (typeof UTM_PARAMETERS)[number]["key"];

type UTMBuilderProps = {
  values: Record<UTMParameter, string | null | undefined>;
  onChange: (key: UTMParameter, value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  disabledTooltip?: string | ReactNode;
  className?: string;
};

export function UTMBuilder(props: UTMBuilderProps) {
  const { values, onChange, disabled, autoFocus, disabledTooltip, className } =
    props;
  const { isMobile } = useMediaQuery();

  const id = useId();
  const [showParams, setShowParams] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Hacky fix to focus the input automatically in modals where normally it doesn't work
  useEffect(() => {
    if (inputRef.current && !isMobile && autoFocus)
      setTimeout(() => inputRef.current?.focus(), 10);
  }, [autoFocus, isMobile]);

  return (
    <div className={cn("grid gap-y-3", className)}>
      {UTM_PARAMETERS.map(
        ({ key, icon: Icon, label, placeholder, description }, idx) => {
          return (
            <div key={key} className="group relative">
              <div className="relative z-10 flex">
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-l-md border-y border-l border-gray-300 bg-gray-50 px-3 py-1.5 text-gray-700",
                        showParams ? "sm:min-w-36" : "sm:min-w-28",
                      )}
                      onClick={() => setShowParams((s) => !s)}
                    >
                      <Icon className="size-4 shrink-0" />
                      <label
                        htmlFor={`${id}-${key}`}
                        className="select-none text-sm"
                      >
                        {showParams ? (
                          <span className="font-mono text-xs">{key}</span>
                        ) : (
                          label
                        )}
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4}>
                    <div className="p-3 text-center text-xs">
                      <p className="text-gray-600">{description}</p>
                      <span className="font-mono text-gray-400">{key}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <div className="min-w-0 grow">
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
                </div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
