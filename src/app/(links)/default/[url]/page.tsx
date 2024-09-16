"use client";

import { useEffect } from "react";
import DeepLinker from "./utils";

type DeepLinkMap = Record<
  string,
  {
    web: string;
    android: string;
    ios: string;
  }
>;

export default function UrlRedirectPage({
  params,
}: {
  params: { url: string };
}) {
  useEffect(() => {
    const deepLinkMap: DeepLinkMap = {
      "youtube.com": {
        web: "https://www.youtube.com/watch?v=",
        android: `intent://www.youtube.com/watch?v=%s#Intent;package=com.google.android.youtube;scheme=https;S.browser_fallback_url=${encodeURIComponent(decodeURIComponent(params.url))}end;`,
        ios: "youtube://www.youtube.com/watch?v=",
      },
      // Add more platforms as needed
    };

    function generateDeepLink(
      url: string,
      platform: "web" | "android" | "ios",
    ): string {
      const urlObj = new URL(url);
      const host = urlObj.hostname.replace("www.", "");
      const videoId = urlObj.searchParams.get("v");

      if (deepLinkMap[host] && videoId) {
        if (platform === "android") {
          return deepLinkMap[host].android.replace("%s", videoId);
        } else if (platform === "ios") {
          return deepLinkMap[host].ios + videoId;
        }
      }

      return url; // Default to original URL if no deep link is available
    }

    const handleRedirect = async () => {
      const data = {
        deepLink: generateDeepLink(decodeURIComponent(params.url), "android"),
        platform: "android",
        url: decodeURIComponent(params.url),
      };

      if (data.platform === "android" || data.platform === "ios") {
        const linker = new DeepLinker({
          onIgnored: () => {
            window.location.href = data.url;
          },
          onFallback: () => {
            window.location.href = data.url;
          },
        });
        linker.openURL(data.deepLink);

        return () => linker.destroy();
      } else {
        // For web, just redirect to the URL
        window.location.href = data.url;
      }
    };

    void handleRedirect();
  }, [params.url]);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      Redirecting...
    </main>
  );
}
