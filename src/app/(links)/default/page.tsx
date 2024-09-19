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
        window.location.href = url;
      },
      onFallback: () => {
        window.location.href = url;
      },
    });
    storeLinker.openURL(storeDeepLink);
  } catch {
    window.location.href = url;
  }
};

const handleDeeplinkFallback = (
  url: string,
  deeplink: string,
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
  linker.openURL(deeplink);
};

export default function UrlRedirectPage() {
  const searchParams = useSearchParams();
  const url = searchParams?.get("url") ?? "";
  const deeplink = searchParams?.get("deeplink") ?? "";
  const storeUrl = searchParams?.get("store") ?? "";

  useLayoutEffect(() => {
    if (deeplink) {
      handleDeeplinkFallback(url, deeplink, storeUrl);
    } else if (storeUrl) {
      handleStoreRedirectionFallback(url, storeUrl);
    } else {
      window.location.href = url;
    }
  }, [deeplink, storeUrl, url]);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      {deeplink}
    </main>
  );
}
