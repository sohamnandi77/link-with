"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import UserAvatar from "./widgets/user-avatar";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block pt-1.5">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full"
            aria-label="Open user menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            <UserAvatar
              src={session?.user?.image ?? ""}
              name={session?.user?.name ?? ""}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
            <Separator />
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={async () => {
                await signOut({
                  callbackUrl: "/login",
                });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
