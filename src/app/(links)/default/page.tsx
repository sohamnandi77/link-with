"use client";

import { DeepLinker } from "@/lib/deeplinker";
import { constructStoreUrl } from "@/lib/functions/construct-store-url";
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
  // const searchParams = useSearchParams();
  // const url = searchParams?.get("url") ?? "";
  // const deeplinkUrl = searchParams?.get("deeplink") ?? "";
  // const storeUrl = searchParams?.get("store") ?? "";
  const url = "https://www.youtube.com/watch?v=sFMRqxCexDk";
  const deeplinkUrl =
    "intent://youtube.com/watch?v=sFMRqxCexDk#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=https://www.youtube.com/watch?v=sFMRqxCexDk;end;";
  const storeUrl =
    "https://play.google.com/store/apps/details?id=com.google.android.youtube";

  useLayoutEffect(() => {
    // Record Link

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
