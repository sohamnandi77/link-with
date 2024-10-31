import { Button } from "@/components/ui/button";
import { Copy, Ellipsis } from "lucide-react";
import Image from "next/image";

const LinkCard = () => {
  return (
    <div className="rounded-xl border border-[#F0F0F0] p-6">
      <div className="flex align-top">
        <Image
          src="https://placehold.co/79x62.png"
          alt="placeholder"
          width={79}
          height={62}
        />
        <div className="ml-4">
          <div className="text-base font-semibold">
            Daily UI Day 4 - Profile UI screen - Nidhi Kumar
          </div>
          <div className="text-sm">description</div>
          <div className="text-xs">25 aug . 8:30 am</div>
        </div>
        <div className="ml-auto">
          <Ellipsis className="rotate-90 cursor-pointer" />
        </div>
      </div>
      <div className="mt-5 flex items-center space-x-4">
        <div className="flex w-full items-center justify-between rounded-xl border border-[#E9D5FF] px-4 py-[14px]">
          <Button variant="link" className="h-4 p-0 text-sm">
            gotoapp.in/re343xf
          </Button>
          <Copy />
        </div>
        <div className="flex min-w-max flex-col rounded-xl border border-[#E9D5FF] px-2 py-1">
          <div className="text-base font-semibold">100k</div>
          <div className="text-sm">Clicks</div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
