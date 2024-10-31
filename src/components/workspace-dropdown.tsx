"use client";

import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from "@/components/widgets/responsive-popover";
import CreateWorkspaceCard from "@/features/workspaces/components/create-workspace-card";
import { useTop2Workspaces } from "@/lib/api/use-top-two-workspaces";
import { capitalize } from "@/lib/functions/capitalize";
import { pluralize } from "@/lib/functions/plural";
import {
  CheckCircle2Icon,
  ChevronDown,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  UserAvatarWithDetails,
  UserDropdownContent,
} from "./user-dropdown-content";
import UserAvatar from "./widgets/user-avatar";

type WorkspaceDropdownProps = {
  slug: string;
  email?: string;
  name?: string;
  image?: string;
};

const WorkspaceDropdown = (props: WorkspaceDropdownProps) => {
  const { slug } = props;
  const { data: session } = useSession();
  const { data, isLoading } = useTop2Workspaces(slug);
  const [open, setOpen] = useState(false);

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  const { selectedWorkspace, workspaces } = data;

  return (
    <ResponsivePopover onOpenChange={setOpen} open={open}>
      <ResponsivePopoverTrigger asChild>
        <Button variant="ghost" className="group p-0 hover:bg-transparent">
          <UserAvatarWithDetails
            image={selectedWorkspace?.logo ?? ""}
            name={selectedWorkspace?.name ?? ""}
          >
            <ChevronDown className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </UserAvatarWithDetails>
        </Button>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent
        popoverProps={{
          className: "w-80",
          align: "end",
          alignOffset: 2,
        }}
      >
        <div className="divide-y border-[#E6E6E6]">
          {/* Current Workspace Details */}
          {selectedWorkspace ? (
            <div className="space-y-3 pb-6">
              <div className="flex items-center space-x-3">
                <UserAvatar
                  src={selectedWorkspace?.logo ?? ""}
                  name={selectedWorkspace?.name ?? ""}
                />
                <div className="flex flex-col">
                  <span className="text-base">{selectedWorkspace?.name}</span>
                  <ul className="flex items-center space-x-5 text-xs text-gray-500">
                    <li>{capitalize(selectedWorkspace?.plan)}</li>
                    <li className="list-disc">
                      {pluralize(selectedWorkspace._count.users, "member")}
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href={`/${selectedWorkspace.slug}/settings`}
                onClick={() => setOpen(false)}
              >
                <Button variant="outline" className="mt-4 w-full space-x-2">
                  <Settings className="size-4" />
                  <span>Workspace settings</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full space-x-2">
                <User className="size-4" />
                <span>Invite members</span>
              </Button>
            </div>
          ) : null}
          {/* Your Workspaces */}
          {workspaces?.length ? (
            <div className="pb-6 pt-5">
              <div className="flex items-center justify-between text-sm">
                <div className="text-[#686868]">Your Workspaces</div>
                <Link href="/workspaces" onClick={() => setOpen(false)}>
                  <Button variant="ghost">View All</Button>
                </Link>
              </div>
              <div className="mt-4 space-y-6">
                {workspaces.map((workspace) => {
                  const isSelected = workspace?.id === selectedWorkspace?.id;
                  return (
                    <Link
                      href={`/${workspace?.slug}`}
                      key={workspace?.id}
                      className="flex items-center"
                      onClick={() => setOpen(false)}
                    >
                      <UserAvatar
                        src={workspace?.logo ?? ""}
                        name={workspace?.name ?? ""}
                      />
                      <div className="ml-3 flex flex-col">
                        <span className="text-base">{workspace?.name}</span>
                        <ul className="flex items-center space-x-5 text-xs text-gray-500">
                          <li>{capitalize(workspace?.plan)}</li>
                          <li className="list-disc">
                            {pluralize(workspace._count.users, "member")}
                          </li>
                        </ul>
                      </div>
                      {isSelected ? (
                        <div className="ml-auto">
                          <CheckCircle2Icon className="size-4" />
                        </div>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
              <CreateWorkspaceCard>
                <Button variant="outline" className="mt-6 w-full space-x-2">
                  <Plus className="size-4" />
                  <span>Add New Workspace</span>
                </Button>
              </CreateWorkspaceCard>
            </div>
          ) : null}
          {/* Your profile Details */}
          <div className="pt-5">
            <UserDropdownContent
              image={session?.user?.image ?? ""}
              name={session?.user?.name ?? ""}
              subtext={session?.user?.email ?? ""}
            />
          </div>
        </div>
      </ResponsivePopoverContent>
    </ResponsivePopover>
  );
};

export default WorkspaceDropdown;
