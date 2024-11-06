import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ReactNode } from "react";

export function DisabledTooltipWrapper({
  children,
  disabledTooltip,
}: {
  children: ReactNode;
  disabledTooltip?: string | ReactNode;
}) {
  return disabledTooltip ? (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{disabledTooltip}</TooltipContent>
    </Tooltip>
  ) : (
    children
  );
}
