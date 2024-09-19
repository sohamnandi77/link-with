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
