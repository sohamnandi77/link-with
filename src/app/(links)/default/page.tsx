"use client";

import { useLayoutEffect } from "react";

import { DeepLinker } from "@/lib/deeplinker";
import { constructStoreUrl } from "@/lib/functions/construct-store-url";

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

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export default function UrlRedirectPage() {
  const url = decodeURIComponent(getCookie("url") ?? "");
  const deeplink = decodeURIComponent(getCookie("deeplink") ?? "");
  const storeUrl = decodeURIComponent(getCookie("store") ?? "");

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
      Redirecting...
    </main>
  );
}
