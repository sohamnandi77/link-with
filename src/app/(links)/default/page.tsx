"use client";

import { DeepLinker } from "@/lib/deeplinker";
import { constructStoreUrl } from "@/lib/functions/construct-store-url";
import { useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

const handleStoreRedirectionFallback = (url: string, storeUrl: string) => {
  try {
    const storeDeepLink = constructStoreUrl(storeUrl);
    const storeLinker = new DeepLinker({
      onIgnored: () => {
        window.location.href = storeUrl;
      },
      onFallback: () => {
        window.location.href = storeUrl;
      },
    });
    storeLinker.openURL(storeDeepLink);
  } catch {
    window.location.href = url;
  }
};

const handleDeeplinkFallback = (
  url: string,
  deepLink: string,
  storeUrl: string,
) => {
  const linker = new DeepLinker({
    onIgnored: () => {
      if (storeUrl) handleStoreRedirectionFallback(url, storeUrl);
      else window.location.href = url;
    },
    onFallback: () => {
      if (storeUrl) handleStoreRedirectionFallback(url, storeUrl);
      else window.location.href = url;
    },
  });
  linker.openURL(deepLink);
};

export default function UrlRedirectPage() {
  const searchParams = useSearchParams();
  const url = searchParams?.get("url") ?? "";
  const deeplinkUrl = searchParams?.get("deeplink") ?? "";
  const storeUrl = searchParams?.get("store") ?? "";
  console.log({ url, deeplinkUrl, storeUrl });

  useLayoutEffect(() => {
    // Record Link
    // const url = decodeURIComponent(link ?? "");
    // const deeplinkUrl = decodeURIComponent(deeplink ?? "");
    // const storeUrl = decodeURIComponent(store ?? "");

    if (deeplinkUrl) {
      handleDeeplinkFallback(url, deeplinkUrl, storeUrl);
    } else if (storeUrl) {
      handleStoreRedirectionFallback(url, storeUrl);
    } else {
      window.location.href = url;
    }
  }, [deeplinkUrl, storeUrl, url]);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      Redirecting...
    </main>
  );
}
