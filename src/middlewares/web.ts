import { type NextRequest, NextResponse } from "next/server";
import { createResponseWithCookie } from "./utils/create-response-with-cookie";
import { getFinalUrl } from "./utils/get-final-url";
import { getHeaders } from "./utils/get-headers";

interface DefaultRedirectMiddlewareProps {
  req: NextRequest;
  url: string;
  key: string;
  clickId: string;
  shouldIndex: boolean;
  originalKey: string;
  collectAnalytics: boolean;
}

export default async function WebMiddleware({
  req,
  url,
  key,
  clickId,
  shouldIndex,
  originalKey,
  collectAnalytics,
}: DefaultRedirectMiddlewareProps) {
  if (!collectAnalytics) {
    return createResponseWithCookie(
      NextResponse.redirect(getFinalUrl({ url, req }), {
        ...getHeaders(shouldIndex),
        status: key === "_root" ? 301 : 302,
      }),
      { clickId, path: `/${originalKey}` },
    );
  }

  return createResponseWithCookie(
    NextResponse.rewrite(
      new URL(
        `/default/${encodeURIComponent(getFinalUrl({ url, req }))}`,
        req.url,
      ),
      {
        ...getHeaders(shouldIndex),
      },
    ),
    { clickId, path: `/${originalKey}` },
  );
}
