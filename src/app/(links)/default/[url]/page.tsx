"use client";

import { useEffect } from "react";
import { browserDeeplink } from "./utils";

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
        android:
          "intent://www.youtube.com/watch?v=%s#Intent;package=com.google.android.youtube;scheme=https;end",
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
        try {
          await browserDeeplink(data.deepLink, { waitTimeout: 1000 });
        } catch (error) {
          console.log(
            "App not installed or couldn't be opened. Redirecting to web.",
            error,
          );
          window.location.href = data.url;
        }

        // // For mobile, try to open the app first
        // const appTimeout = setTimeout(() => {
        //   window.location.href = data.url; // Fallback to web URL if app doesn't open
        // }, 2500); // Wait for 2.5 seconds before falling back

        // window.location.href = data.deepLink;

        // // If the page is still here after a short delay, the app isn't installed
        // window.onblur = () => {
        //   clearTimeout(appTimeout);
        // };

        // // Ensure we clean up the onblur handler when the component unmounts
        // return () => {
        //   clearTimeout(appTimeout);
        //   window.onblur = null;
        // };
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
