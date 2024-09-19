import { type NextRequest, NextResponse } from "next/server";
import { SUPPORTED_DOMAINS } from "./deeplink/apps-config";
import SupportedAppMiddleware from "./supported-app";
import { createResponseWithCookie } from "./utils/create-response-with-cookie";
import { getDeeplinkUrl } from "./utils/get-final-url";
import { getHeaders } from "./utils/get-headers";

interface AndroidMiddlewareProps {
  req: NextRequest;
  shouldIndex: boolean;
  key: string;
  url: string;
  collectAnalytics: boolean;
  clickId: string;
  originalKey: string;
  android: string | null;
}

export default async function AndroidMiddleware(props: AndroidMiddlewareProps) {
  const {
    req,
    android,
    key,
    shouldIndex,
    url,
    collectAnalytics,
    clickId,
    originalKey,
  } = props;
  if (android) {
    // check if it is an app store link -> url of store link
    if (android.includes(SUPPORTED_DOMAINS.GOOGLE_PLAY_STORE)) {
      const finalUrl = getDeeplinkUrl({
        route: "/default",
        req,
        url,
        storeUrl: android ?? "",
        collectAnalytics,
      });
      return createResponseWithCookie(
        NextResponse.rewrite(finalUrl, {
          ...getHeaders(shouldIndex),
        }),
        { clickId, path: `/${originalKey}` },
      );
    }
    // check it is a intent url
    if (android.includes("intent://")) {
      const finalUrl = getDeeplinkUrl({
        route: "/default",
        req,
        url,
        deeplink: android ?? "",
        collectAnalytics,
      });
      return createResponseWithCookie(
        NextResponse.rewrite(finalUrl, {
          ...getHeaders(shouldIndex),
        }),
        { clickId, path: `/${originalKey}` },
      );
    }

    // special 50 middleware => android
    return SupportedAppMiddleware({
      req,
      key,
      ua: "android",
      shouldIndex,
      url: android,
      clickId,
      collectAnalytics,
      originalKey,
    });
  }

  return SupportedAppMiddleware({
    req,
    key,
    ua: "android",
    shouldIndex,
    url,
    clickId,
    collectAnalytics,
    originalKey,
  });
}
