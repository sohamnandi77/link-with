import { type NextRequest, NextResponse } from "next/server";
import { SUPPORTED_DOMAINS } from "./deeplink/apps-config";
import SupportedAppMiddleware from "./supported-app";
import { addCookiesForRedirectResponse } from "./utils/create-response-with-cookie";
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
      return addCookiesForRedirectResponse(
        NextResponse.rewrite("/default", {
          ...getHeaders(shouldIndex),
        }),
        {
          url,
          storeUrl: ios ?? "",
          collectAnalytics,
          path: "/",
        },
      );
    }
    // check it is a uri scheme
    if (!ios.includes("https://") || !ios.includes("http://")) {
      return addCookiesForRedirectResponse(
        NextResponse.rewrite("/default", {
          ...getHeaders(shouldIndex),
        }),
        {
          url,
          deeplink: ios ?? "",
          collectAnalytics,
          path: "/",
        },
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
