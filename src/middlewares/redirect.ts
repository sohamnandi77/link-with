import { NextResponse, userAgent, type NextRequest } from "next/server";
import { createResponseWithCookie } from "./utils/create-response-with-cookie";
import { getFinalUrl } from "./utils/get-final-url";
import { getHeaders } from "./utils/get-headers";

export default async function RedirectMiddleware(
  req: NextRequest,
  url: string,
  key: string,
  clickId: string,
  shouldIndex: boolean,
  originalKey: string,
) {
  const isIOS = userAgent(req)?.os?.name === "iOS";
  const isAndroid = userAgent(req)?.os?.name === "Android";
  const isWeb = !isIOS && !isAndroid;

  console.log("userAgent", userAgent(req));

  if (isWeb) {
    return createResponseWithCookie(
      NextResponse.redirect(
        getFinalUrl(url, {
          req,
        }),
        {
          ...getHeaders(shouldIndex),
          status: key === "_root" ? 301 : 302,
        },
      ),
      { clickId, path: `/${originalKey}` },
    );
  }

  return createResponseWithCookie(
    NextResponse.rewrite(
      new URL(
        `/default/${encodeURIComponent(getFinalUrl(url, { req }))}`,
        req.url,
      ),
      {
        ...getHeaders(shouldIndex),
      },
    ),
    { clickId, path: `/${originalKey}` },
  );
}
