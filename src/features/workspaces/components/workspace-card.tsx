import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  slug: string;
  logo: string | null;
  usersCount: number;
  linksCount: number;
  isDefault: boolean;
  users: {
    id: string;
    image: string | null;
    name: string | null;
  }[];
};

const WorkspaceCard = (props: WorkspaceCardProps) => {
  const {
    id,
    name,
    slug,
    logo,
    plan,
    usersCount,
    linksCount,
    users,
    isDefault,
  } = props;

  return (
    <Card key={id} className="w-[292px] border border-gray-200 p-4">
      <Link href={`/${slug}`} className="cursor-pointer">
        <Image
          src={logo ?? "https://placehold.co/260x260.png"}
          alt={name}
          width={260}
          height={260}
          className="aspect-square w-full rounded-md object-cover"
        />
        <div className="mt-3 flex items-center">
          <h2 className="text-base font-semibold">{name}</h2>
          {isDefault ? (
            <Badge variant="outline" className="ml-3">
              Default
            </Badge>
          ) : null}
        </div>
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
      </Link>
      <Link href={`/${slug}/settings`}>
        <Button variant="outline" className="mt-6 w-full space-x-2">
          <Settings className="size-4" />
          <span className="text-sm">Workspace Settings</span>
        </Button>
      </Link>
    </Card>
  );
};

export default WorkspaceCard;
