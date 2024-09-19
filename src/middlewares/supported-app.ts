import { NextResponse, type NextRequest } from "next/server";
import {
  convertToAndroidAppUrl,
  convertToIosAppUrl,
} from "./deeplink/convert-to-app-url";
import { addCookiesForRedirectResponse } from "./utils/create-response-with-cookie";
import { getHeaders } from "./utils/get-headers";
import WebMiddleware from "./web";

interface SupportedAppMiddlewareProps {
  req: NextRequest;
  ua: "ios" | "android" | "web";
  shouldIndex: boolean;
  key: string;
  url: string;
  collectAnalytics: boolean;
}

export default async function SupportedAppMiddleware(
  props: SupportedAppMiddlewareProps,
) {
  const { req, key, ua, shouldIndex, url, collectAnalytics } = props;

  if (ua === "ios") {
    const appUrl = convertToIosAppUrl(url);
    if (appUrl?.ios) {
      return addCookiesForRedirectResponse(
        NextResponse.rewrite(new URL("/default", req.url), {
          ...getHeaders(shouldIndex),
        }),
        {
          url,
          deeplink: appUrl.ios ?? "",
          storeUrl: appUrl?.appStore ?? "",
          collectAnalytics,
          path: "/",
        },
      );
    }
  } else if (ua === "android") {
    const appUrl = convertToAndroidAppUrl(url);
    if (appUrl?.android) {
      return addCookiesForRedirectResponse(
        NextResponse.rewrite(new URL("/default", req.url), {
          ...getHeaders(shouldIndex),
        }),
        {
          url,
          deeplink: appUrl.android ?? "",
          storeUrl: appUrl?.playStore ?? "",
          collectAnalytics,
          path: "/",
        },
      );
    }
  }

  return WebMiddleware({
    req,
    url,
    key,
    shouldIndex,
    collectAnalytics,
  });
}
