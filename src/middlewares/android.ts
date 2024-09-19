import { type NextRequest, NextResponse } from "next/server";
import { APPS } from "./deeplink/apps-config";
import SupportedAppMiddleware from "./supported-app";
import { createResponseWithCookie } from "./utils/create-response-with-cookie";
import { getFinalUrl } from "./utils/get-final-url";
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
    if (android.includes(APPS.GOOGLE_PLAYSTORE.DOMAIN)) {
      return createResponseWithCookie(
        NextResponse.rewrite(
          new URL(
            `/default/${encodeURIComponent(getFinalUrl({ url, req, storeUrl: android, collectAnalytics }))}`,
            req.url,
          ),
          {
            ...getHeaders(shouldIndex),
          },
        ),
        { clickId, path: `/${originalKey}` },
      );
    }
    // check it is a uri scheme
    if (!android.includes("https://") || !android.includes("http://")) {
      return createResponseWithCookie(
        NextResponse.rewrite(
          new URL(
            `/default/${encodeURIComponent(getFinalUrl({ url, req, deeplink: android, collectAnalytics }))}`,
            req.url,
          ),
          {
            ...getHeaders(shouldIndex),
          },
        ),
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
