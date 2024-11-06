import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { generateInitials } from "@/lib/functions/generate-initials";

type UserAvatarProps = {
  src: string;
  name: string;
  className?: string;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { src, name, className } = props;

  return (
    <Avatar className={className}>
      {/* <AvatarImage src={src} alt={name} /> */}
      <AvatarFallback>{generateInitials(name)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
