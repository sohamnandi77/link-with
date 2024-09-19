import { type NextRequest, NextResponse } from "next/server";
import { SUPPORTED_DOMAINS } from "./deeplink/apps-config";
import SupportedAppMiddleware from "./supported-app";
import { addCookiesForRedirectResponse } from "./utils/create-response-with-cookie";
import { getHeaders } from "./utils/get-headers";

interface AndroidMiddlewareProps {
  req: NextRequest;
  shouldIndex: boolean;
  key: string;
  url: string;
  collectAnalytics: boolean;
  android: string | null;
}

export default async function AndroidMiddleware(props: AndroidMiddlewareProps) {
  const { req, android, key, shouldIndex, url, collectAnalytics } = props;
  if (android) {
    // check if it is an app store link -> url of store link
    if (android.includes(SUPPORTED_DOMAINS.GOOGLE_PLAY_STORE)) {
      return addCookiesForRedirectResponse(
        NextResponse.rewrite(new URL("/default", req.url), {
          ...getHeaders(shouldIndex),
        }),
        {
          url,
          storeUrl: android ?? "",
          collectAnalytics,
          path: "/",
        },
      );
    }
    // check it is a intent url
    if (android.includes("intent://")) {
      return addCookiesForRedirectResponse(
        NextResponse.rewrite(new URL("/default", req.url), {
          ...getHeaders(shouldIndex),
        }),
        {
          url,
          deeplink: android ?? "",
          collectAnalytics,
          path: "/",
        },
      );
    }

    // special 50 middleware => android
    return SupportedAppMiddleware({
      req,
      key,
      ua: "android",
      shouldIndex,
      url: android,
      collectAnalytics,
    });
  }

  return SupportedAppMiddleware({
    req,
    key,
    ua: "android",
    shouldIndex,
    url,
    collectAnalytics,
  });
}
