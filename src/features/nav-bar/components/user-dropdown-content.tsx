import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/widgets/user-avatar";
import { LogOut, Settings } from "lucide-react";

interface UserDropdownContentProps {
  image?: string;
  name?: string;
  subtext?: string;
}

interface UserDropdownAvatarProps extends UserDropdownContentProps {
  children?: React.ReactNode;
}

export const UserAvatarWithDetails = (props: UserDropdownAvatarProps) => {
  const { image, name, subtext, children } = props;
  return (
    <div className="flex items-center space-x-3">
      <UserAvatar src={image ?? ""} name={name ?? ""} />
      <div className="flex space-x-1">
        <div className="flex flex-col">
          <span className="text-base">{name}</span>
          <span className="text-xs text-[#909090]">{subtext}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export const UserDropdownContent = (props: UserDropdownContentProps) => {
  const { image, name, subtext: email } = props;
  return (
    <div className="space-y-4">
      <div className="text-sm text-[#686868]">Your Profile</div>
      <UserAvatarWithDetails image={image} name={name} subtext={email} />
      <Button variant="outline" className="mt-6 w-full space-x-2">
        <Settings className="size-4" />
        <span>Setting</span>
      </Button>
      <Button variant="outline" className="w-full space-x-2">
        <LogOut className="size-4" />
        <span>Log out</span>
      </Button>
    </div>
  );
};
