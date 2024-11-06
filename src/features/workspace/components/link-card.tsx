import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/widgets/file-upload";
import { convertEpochToDateString } from "@/lib/functions/date";
import { type LinkSchema } from "@/schema/links";
import { Copy, Ellipsis } from "lucide-react";
import Link from "next/link";
import { type z } from "zod";

const LinkCard = (props: z.infer<typeof LinkSchema>) => {
  const { ogImage, ogTitle, ogDescription, clicks, shortLink, updatedAt } =
    props;
  return (
    <div className="rounded-xl border border-[#F0F0F0] p-6">
      <div className="flex align-top">
        <div className="bg-whitegroup group relative h-full w-96 overflow-hidden rounded-md border border-gray-300">
          <FileUpload
            className="group-hover:scale-105"
            accept="images"
            variant="plain"
            imageSrc={ogImage}
            clickToUpload={false}
            showHoverOverlay={false}
          />
        </div>
        <div className="ml-4">
          <div className="text-base font-semibold">{ogTitle}</div>
          <div className="text-sm">{ogDescription}</div>
          <div className="text-xs">
            {convertEpochToDateString(new Date(updatedAt)?.getTime())}
          </div>
        </div>
        <div className="ml-auto">
          <Ellipsis className="rotate-90 cursor-pointer" />
        </div>
      </div>
      <div className="mt-5 flex items-center space-x-4">
        <div className="flex w-full items-center justify-between rounded-xl border border-[#E9D5FF] px-4 py-[14px]">
          <Link href={shortLink} target="_blank">
            <Button variant="link" className="h-4 p-0 text-sm">
              {shortLink}
            </Button>
          </Link>
          <Copy />
        </div>
        <div className="flex min-w-max flex-col rounded-xl border border-[#E9D5FF] px-2 py-1">
          <div className="text-base font-semibold">{clicks}</div>
          <div className="text-sm">Clicks</div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
