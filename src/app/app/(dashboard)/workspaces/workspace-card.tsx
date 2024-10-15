import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/widgets/user-avatar";
import { capitalize } from "@/lib/functions/capitalize";
import { pluralize } from "@/lib/functions/plural";
import { Link as LinkIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type WorkspaceCardProps = {
  id: string;
  name: string;
  plan: string;
  usersCount: number;
  linksCount: number;
  users: {
    id: string;
    image: string | null;
    name: string | null;
  }[];
};

const WorkspaceCard = (props: WorkspaceCardProps) => {
  const { id, name, plan, usersCount, linksCount, users } = props;
  return (
    <div key={id} className="w-[292px] rounded-md border border-gray-200 p-4">
      <Image
        src="https://placehold.co/260x260.png"
        alt={name}
        width={260}
        height={260}
      />
      <h2 className="mt-3 text-base font-semibold">{name}</h2>
      <ul className="flex items-center space-x-5 text-sm text-gray-500">
        <li>{capitalize(plan)}</li>
        <li className="list-disc">{pluralize(usersCount, "member")}</li>
      </ul>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <LinkIcon className="size-4" />
          <span className="font-medium">{pluralize(linksCount, "link")}</span>
        </div>
        <div>
          {users.map((user) => (
            <UserAvatar
              className="size-5"
              key={user.id}
              src={user.image ?? ""}
              name={user?.name ?? ""}
            />
          ))}
        </div>
      </div>
      <Link href="/settings">
        <Button variant="outline" className="mt-6 w-full space-x-2">
          <Settings className="size-4" />
          <span className="text-sm">Workspace Settings</span>
        </Button>
      </Link>
    </div>
  );
};

export default WorkspaceCard;
