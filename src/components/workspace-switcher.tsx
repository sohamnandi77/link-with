import { Button } from "@/components/ui/button";
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from "@/components/widgets/responsive-popover";
import { getSession } from "@/lib/auth/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import UserAvatar from "./widgets/user-avatar";

export default async function WorkspaceSwitcher() {
  const session = await getSession();

  return (
    <ResponsivePopover>
      <ResponsivePopoverTrigger asChild>
        <div className="flex items-center space-x-3">
          <UserAvatar
            src={session?.user?.image ?? ""}
            name={session?.user?.name ?? ""}
          />
          <div className="flex space-x-1">
            <span>{session?.user?.name}</span>
            <ChevronDown />
          </div>
        </div>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent
        popoverProps={{
          className: "w-80",
          align: "end",
          alignOffset: 2,
        }}
      >
        <div className="flex space-x-3">
          <UserAvatar
            src={session?.user?.image ?? ""}
            name={session?.user?.name ?? ""}
          />
          <div>
            <span>{session?.user?.name}</span>{" "}
          </div>
        </div>
        <Link href="/settings">
          <Button>Workspace Settings</Button>
        </Link>
        <Link href="/settings">
          <Button>Invite members</Button>
        </Link>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  );
}
