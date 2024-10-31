import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/widgets/file-upload";
import { resizeImage } from "@/lib/functions/resize-image";
import { type createLinkBodySchema } from "@/schema/links";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";

const CustomizeLinkPreview = () => {
  const { control, watch, setValue } =
    useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { ogImage, ogTitle, ogDescription } = watch();
  const [resizing, setResizing] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>Image</div>
        <FileUpload
          accept="images"
          variant="default"
          imageSrc={ogImage}
          onChange={async ({ file }) => {
            setResizing(true);

            const image = await resizeImage(file);
            setValue("ogImage", image, { shouldDirty: true });
            setValue("proxy", true, { shouldDirty: true });

            // Delay to prevent flickering
            setTimeout(() => setResizing(false), 500);
          }}
          loading={resizing} // generatingMetatags || resizing
          clickToUpload={true}
          showHoverOverlay={false}
          accessibilityLabel="OG image upload"
          className="mt-2"
          content={
            <>
              <p>Drag and drop or click to upload.</p>
              <p className="mt-1">Recommended: 1200 x 630 pixels</p>
            </>
          }
        />
      </div>
      <div className="space-y-3">
        <FormField
          control={control}
          name="ogTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter the title for your link"
                  value={ogTitle ?? ""}
                  onChange={(e) => {
                    setValue("ogTitle", e.target.value, { shouldDirty: true });
                    setValue("proxy", true, { shouldDirty: true });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-3">
        <FormField
          control={control}
          name="ogDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter the description for your link"
                  value={ogDescription ?? ""}
                  onChange={(e) => {
                    setValue("ogDescription", e.target.value, {
                      shouldDirty: true,
                    });
                    setValue("proxy", true, { shouldDirty: true });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CustomizeLinkPreview;
