import { NextResponse, type NextRequest } from "next/server";
import { convertToAppUrl } from "./deeplink/convert-to-app-url";
import { createResponseWithCookie } from "./utils/create-response-with-cookie";
import { getFinalUrl } from "./utils/get-final-url";
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

  const appUrl = convertToAppUrl(url);

  console.log("Supported App", appUrl);

  if (ua === "ios" && appUrl?.ios) {
    return createResponseWithCookie(
      NextResponse.rewrite(
        new URL(
          `/default/${encodeURIComponent(
            getFinalUrl({
              url,
              req,
              deeplink: appUrl.ios,
              storeUrl: appUrl?.appStore ?? "",
              collectAnalytics,
            }),
          )}`,
          req.url,
        ),
        {
          ...getHeaders(shouldIndex),
        },
      ),
      { clickId, path: `/${originalKey}` },
    );
  }

  if (ua === "android" && appUrl?.android) {
    console.log("Supported App Android");
    return createResponseWithCookie(
      NextResponse.rewrite(
        new URL(
          `/default/${encodeURIComponent(
            getFinalUrl({
              url,
              req,
              deeplink: appUrl.android,
              storeUrl: appUrl?.playStore ?? "",
              collectAnalytics,
            }),
          )}`,
          req.url,
        ),
        {
          ...getHeaders(shouldIndex),
        },
      ),
      { clickId, path: `/${originalKey}` },
    );
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
