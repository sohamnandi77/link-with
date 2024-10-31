import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TopCardProps {
  title: string;
  value: string;
}

const TopCard = (props: TopCardProps) => {
  const { title, value } = props;
  return (
    <div className="w-full rounded-xl border border-[#E6E6E6] p-4">
      <div className="text-base text-[#909090]">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-4xl font-bold">{value}</div>
        <Badge className="rounded-3xl bg-[#E6F6E9]">
          <span className="text-[#006017]">4.1%</span>
          <TrendingUp className="ml-1 size-4 text-[#006017]" />
        </Badge>
      </div>
    </div>
  );
};

export default TopCard;
