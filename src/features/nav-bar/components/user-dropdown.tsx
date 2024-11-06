"use client";

import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from "@/components/widgets/responsive-popover";
import { ChevronDown } from "lucide-react";
import {
  UserAvatarWithDetails,
  UserDropdownContent,
} from "./user-dropdown-content";

type UserDropdownProps = {
  email?: string;
  name?: string;
  image?: string;
};

export default function UserDropdown(props: UserDropdownProps) {
  const { email, name, image } = props;

  return (
    <ResponsivePopover>
      <ResponsivePopoverTrigger asChild>
        <div className="group">
          <UserAvatarWithDetails
            image={image ?? ""}
            name={name ?? ""}
            subtext={email ?? ""}
          >
            <ChevronDown className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </UserAvatarWithDetails>
        </div>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent
        popoverProps={{
          className: "w-80",
          align: "end",
          alignOffset: 2,
        }}
      >
        <div className="divide-y border-[#E6E6E6]">
          <UserDropdownContent
            image={image ?? ""}
            name={name ?? ""}
            subtext={email ?? ""}
          />
        </div>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  );
}
