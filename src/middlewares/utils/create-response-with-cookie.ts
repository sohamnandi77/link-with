import { type NextResponse } from "next/server";

export function createResponseWithCookie(
  response: NextResponse,
  { clickId, path }: { clickId: string; path: string },
): NextResponse {
  response.cookies.set("dclid", clickId, {
    path,
    maxAge: 60 * 60,
  });

  return response;
}

export const addCookiesForRedirectResponse = (
  response: NextResponse,
  params: {
    path: string;
    url?: string;
    storeUrl?: string;
    deeplink?: string;
    collectAnalytics?: boolean;
  },
): NextResponse => {
  const { url, path, storeUrl, deeplink, collectAnalytics } = params;

  if (url) {
    response.cookies.set("url", url, {
      path,
      maxAge: 60 * 60,
      httpOnly: false,
    });
  }

  if (deeplink) {
    response.cookies.set("deeplink", deeplink, {
      path,
      maxAge: 60 * 60,
      httpOnly: false,
    });
  }

  if (storeUrl) {
    response.cookies.set("store", storeUrl, {
      path,
      maxAge: 60 * 60,
      httpOnly: false,
    });
  }

  response.cookies.set("analytics", `${collectAnalytics}`, {
    path,
    maxAge: 60 * 60,
    httpOnly: false,
  });

  return response;
};
