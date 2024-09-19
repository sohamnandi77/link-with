import { type NextRequest, NextResponse } from "next/server";
import { SUPPORTED_DOMAINS } from "./deeplink/apps-config";
import SupportedAppMiddleware from "./supported-app";
import { createResponseWithCookie } from "./utils/create-response-with-cookie";
import { getDeeplinkUrl } from "./utils/get-final-url";
import { getHeaders } from "./utils/get-headers";

interface IosMiddlewareProps {
  req: NextRequest;
  shouldIndex: boolean;
  key: string;
  url: string;
  collectAnalytics: boolean;
  clickId: string;
  originalKey: string;
  ios: string | null;
}

export default async function IosMiddleware(props: IosMiddlewareProps) {
  const {
    req,
    ios,
    key,
    shouldIndex,
    url,
    collectAnalytics,
    clickId,
    originalKey,
  } = props;
  if (ios) {
    // check if it is an app store link -> url of store link
    if (ios.includes(SUPPORTED_DOMAINS.APPLE_APP_STORE)) {
      const finalUrl = getDeeplinkUrl({
        route: "/default",
        req,
        url,
        storeUrl: ios ?? "",
        collectAnalytics,
      });
      return createResponseWithCookie(
        NextResponse.rewrite(finalUrl, {
          ...getHeaders(shouldIndex),
        }),
        { clickId, path: `/${originalKey}` },
      );
    }
    // check it is a uri scheme
    if (!ios.includes("https://") || !ios.includes("http://")) {
      const finalUrl = getDeeplinkUrl({
        route: "/default",
        req,
        url,
        deeplink: ios ?? "",
        collectAnalytics,
      });
      return createResponseWithCookie(
        NextResponse.rewrite(finalUrl, {
          ...getHeaders(shouldIndex),
        }),
        { clickId, path: `/${originalKey}` },
      );
    }

    // special 50 middleware => ios
    return SupportedAppMiddleware({
      req,
      key,
      ua: "ios",
      shouldIndex,
      url: ios,
      clickId,
      collectAnalytics,
      originalKey,
    });
  }

  return SupportedAppMiddleware({
    req,
    key,
    ua: "ios",
    shouldIndex,
    url,
    clickId,
    collectAnalytics,
    originalKey,
  });
}
