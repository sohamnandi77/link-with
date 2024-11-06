"use client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/widgets/file-upload";
import { Copy, ExternalLink, QrCode, Share, Trash2 } from "lucide-react";
import Link from "next/link";
import { useLinkDetails } from "../api/use-link-details";

const LinkDetailsCard = ({
  linkId,
  slug,
}: {
  slug: string;
  linkId: string;
}) => {
  const { data } = useLinkDetails(linkId, slug);

  return (
    <div className="flex items-center space-x-8">
      <div className="bg-whitegroup group relative h-full w-96 overflow-hidden rounded-md border border-gray-300">
        <FileUpload
          className="group-hover:scale-105"
          accept="images"
          variant="plain"
          imageSrc={data?.ogImage}
          clickToUpload={false}
          showHoverOverlay={false}
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="text-xl font-semibold">{data?.ogTitle}</div>
        <div className="text-sm text-[#686868]">{data?.ogDescription}</div>
        <div></div>
        <div className="mt-5 flex space-x-8">
          <div className="flex w-full items-center justify-between rounded-xl border border-[#E6E6E6] px-4 py-3">
            <Link
              target="_blank"
              className="text-sm text-[#3C9BED]"
              href={data?.shortLink}
            >
              {data?.shortLink}
            </Link>
            <Link href={data?.shortLink} target="_blank">
              <ExternalLink />
            </Link>
          </div>
          <Button className="size-12" variant="outline">
            <Copy />
          </Button>
          <Button className="size-12" variant="outline">
            <Share />
          </Button>
          <Button className="size-12" variant="outline">
            <QrCode />
          </Button>
          <Button className="size-12" variant="destructive">
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkDetailsCard;
