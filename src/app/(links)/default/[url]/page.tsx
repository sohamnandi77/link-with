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

export default function UrlRedirectPage({
  params,
}: {
  params: { url: string };
}) {
  const searchParams = useSearchParams();
  const deeplink = searchParams?.get("deeplink");
  const store = searchParams?.get("store");

  useLayoutEffect(() => {
    // Record Link
    const url = decodeURIComponent(params.url ?? "");
    const deeplinkUrl = decodeURIComponent(deeplink ?? "");
    const storeUrl = decodeURIComponent(store ?? "");

    if (deeplinkUrl) {
      handleDeeplinkFallback(url, deeplinkUrl, storeUrl);
    } else if (storeUrl) {
      handleStoreRedirectionFallback(url, storeUrl);
    } else {
      window.location.href = url;
    }
  }, [deeplink, params.url, store]);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      Redirecting...
      <div>deepLink: {deeplink}</div>
      <div>decode deepLink: {decodeURIComponent(deeplink ?? "")}</div>
      <div>store: {store}</div>
      <div>decode store: {decodeURIComponent(store ?? "")}</div>
      <div>url: {params.url}</div>
    </main>
  );
}
