import { truncate } from "@/lib/functions/truncate";
import { getUrlWithoutUTMParams } from "@/lib/functions/urls";
import { type createLinkBodySchema } from "@/schema/links";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { type z } from "zod";

const useMetatags = () => {
  const { watch, setValue } =
    useFormContext<z.infer<typeof createLinkBodySchema>>();
  const { ogTitle, ogDescription, ogImage, originalLink, proxy, password } =
    watch();
  const [debouncedUrl] = useDebounce(getUrlWithoutUTMParams(originalLink), 500);
  const [generatingMetatags, setGeneratingMetatags] = useState(false);

  useEffect(() => {
    // if there's a password, no need to generate metatags
    if (password) {
      setGeneratingMetatags(false);
      setValue("ogTitle", "Password Required");
      setValue(
        "ogDescription",
        "This link is password protected. Please enter the password to view it.",
      );
      setValue("ogImage", "https://assets.dub.co/misc/password-protected.png");
      return;
    }

    /**
     * Only generate metatags if:
     * - modal is open
     * - custom OG proxy is not enabled
     * - url is not empty
     **/
    if (!proxy) {
      setValue("ogTitle", null);
      setValue("ogDescription", null);
      setValue("ogImage", null);

      try {
        // if url is valid, continue to generate metatags, else return null
        new URL(debouncedUrl);
        setGeneratingMetatags(true);
        fetch(`/api/metatags?url=${debouncedUrl}`)
          .then(async (res) => {
            if (res.status === 200) {
              const results = (await res.json()) as {
                ogTitle: string;
                ogDescription: string;
                ogImage: string;
              };
              setValue("ogTitle", truncate(results.ogTitle, 120));
              setValue("ogDescription", truncate(results.ogDescription, 240));
              setValue("ogImage", results.ogImage);
            }
            // set timeout to prevent flickering
            setTimeout(() => setGeneratingMetatags(false), 200);
          })
          .catch(() => {
            setValue("ogTitle", "");
            setValue("ogDescription", "");
            setValue("ogImage", "");
            setGeneratingMetatags(false);
          });
      } catch {}
    } else {
      setGeneratingMetatags(false);
    }
  }, [debouncedUrl, password, proxy, setValue]);

  return { generatingMetatags, ogTitle, ogDescription, ogImage };
};

export default useMetatags;
