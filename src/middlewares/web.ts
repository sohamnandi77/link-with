import { type NextRequest, NextResponse } from "next/server";
import { addCookiesForRedirectResponse } from "./utils/create-response-with-cookie";
import { getFinalUrl } from "./utils/get-final-url";
import { getHeaders } from "./utils/get-headers";

interface DefaultRedirectMiddlewareProps {
  req: NextRequest;
  url: string;
  key: string;
  shouldIndex: boolean;
  collectAnalytics: boolean;
}

export default async function WebMiddleware({
  req,
  url,
  key,
  shouldIndex,
  collectAnalytics,
}: DefaultRedirectMiddlewareProps) {
  if (!collectAnalytics) {
    return NextResponse.redirect(getFinalUrl({ url, req }), {
      ...getHeaders(shouldIndex),
      status: key === "_root" ? 301 : 302,
    });
  }

  return addCookiesForRedirectResponse(
    NextResponse.rewrite(new URL("/default", req.url), {
      ...getHeaders(shouldIndex),
    }),
    {
      url,
      collectAnalytics,
      path: "/",
    },
  );
}
