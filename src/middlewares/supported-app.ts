import { NextResponse, type NextRequest } from "next/server";
import {
  convertToAndroidAppUrl,
  convertToIosAppUrl,
} from "./deeplink/convert-to-app-url";
import { createResponseWithCookie } from "./utils/create-response-with-cookie";
import { getDeeplinkUrl } from "./utils/get-final-url";
import { getHeaders } from "./utils/get-headers";
import WebMiddleware from "./web";

interface SupportedAppMiddlewareProps {
  req: NextRequest;
  ua: "ios" | "android" | "web";
  shouldIndex: boolean;
  key: string;
  url: string;
  collectAnalytics: boolean;
  clickId: string;
  originalKey: string;
}

export default async function SupportedAppMiddleware(
  props: SupportedAppMiddlewareProps,
) {
  const {
    req,
    key,
    ua,
    shouldIndex,
    url,
    clickId,
    collectAnalytics,
    originalKey,
  } = props;

  if (ua === "ios") {
    const appUrl = convertToIosAppUrl(url);
    if (appUrl?.ios) {
      const finalUrl = getDeeplinkUrl({
        route: "/default",
        req,
        url,
        deeplink: appUrl.ios ?? "",
        storeUrl: appUrl?.appStore ?? "",
        collectAnalytics,
      });
      return createResponseWithCookie(
        NextResponse.rewrite(finalUrl, {
          ...getHeaders(shouldIndex),
        }),
        { clickId, path: `/${originalKey}` },
      );
    }
  } else if (ua === "android") {
    const appUrl = convertToAndroidAppUrl(url);
    if (appUrl?.android) {
      const finalUrl = getDeeplinkUrl({
        route: "/default",
        req,
        url,
        deeplink: appUrl.android ?? "",
        storeUrl: appUrl?.playStore ?? "",
        collectAnalytics,
      });
      console.log(finalUrl);
      return createResponseWithCookie(
        NextResponse.rewrite(finalUrl, {
          ...getHeaders(shouldIndex),
        }),
        { clickId, path: `/${originalKey}` },
      );
    }
  }

  return WebMiddleware({
    req,
    url,
    key,
    clickId,
    shouldIndex,
    originalKey,
    collectAnalytics,
  });
}
