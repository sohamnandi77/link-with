"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/widgets/file-upload";
import { NucleoPhoto } from "@/icons/photo";
import useMetatags from "../api/use-metatags";

type LinkPreviewProps = {
  disabled?: boolean;
};

const LinkPreview = (props: LinkPreviewProps) => {
  const { disabled } = props;
  const { generatingMetatags, ogDescription, ogImage, ogTitle } = useMetatags();
  return (
    <div className="rounded-xl border border-[#E6E6E6] bg-white p-5">
      <div>Link Preview</div>
      <div className="mt-2">
        <div>
          <div className="group relative overflow-hidden rounded-md border border-gray-300">
            {ogImage ? (
              <FileUpload
                className="group-hover:scale-105"
                accept="images"
                variant="plain"
                imageSrc={ogImage}
                loading={generatingMetatags}
                clickToUpload={false}
                showHoverOverlay={false}
                accessibilityLabel="OG image upload"
              />
            ) : (
              <div className="relative aspect-[var(--aspect,1200/630)] w-full bg-white">
                <div className="pointer-events-none relative flex size-full flex-col items-center justify-center gap-2">
                  <NucleoPhoto className="size-5 text-gray-700" />
                  <p className="max-w-32 text-center text-xs text-gray-700">
                    Enter a link to generate a preview
                  </p>
                </div>
              </div>
            )}
          </div>
          {ogTitle && (
            <div className="mt-4 line-clamp-2 w-full resize-none border-none p-0 text-xs font-medium text-gray-700 outline-none focus:ring-0">
              {ogTitle}
            </div>
          )}
          {ogDescription && (
            <div className="mt-2.5 line-clamp-2 w-full resize-none border-none p-0 text-xs text-gray-700/80 outline-none focus:ring-0">
              {ogDescription}
            </div>
          )}
        </div>
      </div>
      <Button className="mt-4 w-full" type="submit" disabled={disabled}>
        Create Your Smart Link
      </Button>
    </div>
  );
};

export default LinkPreview;
