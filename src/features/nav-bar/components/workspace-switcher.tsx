"use client";

import { useParams } from "next/navigation";
import UserDropdown from "./user-dropdown";
import WorkspaceDropdown from "./workspace-dropdown";

type WorkspaceSwitcherProps = {
  user: {
    email: string;
    id: string;
    name: string;
    image?: string;
    defaultWorkspace?: string;
  };
};

export default function WorkspaceSwitcher(props: WorkspaceSwitcherProps) {
  const { user } = props;
  const { slug } = useParams();

  if (slug) {
    return (
      <WorkspaceDropdown
        slug={slug as string}
        email={user?.email ?? ""}
        name={user?.name ?? ""}
        image={user?.image ?? ""}
      />
    );
  }

  return (
    <UserDropdown
      email={user?.email ?? ""}
      name={user?.name ?? ""}
      image={user?.image ?? ""}
    />
  );
}
