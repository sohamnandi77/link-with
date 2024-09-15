import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  API_HOSTNAMES,
  APP_HOSTNAMES,
  DEFAULT_REDIRECTS,
} from "@/constants/config";
import {
  ApiMiddleware,
  AppMiddleware,
  AxiomMiddleware,
  CreateLinkMiddleware,
  LinkMiddleware,
} from "@/middlewares";
import { parse } from "@/middlewares/utils/parse";
import { env } from "./env";
import { isValidUrl } from "./lib/functions/urls";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, key, fullKey } = parse(req);

  AxiomMiddleware(req, ev);

  // for App
  if (APP_HOSTNAMES.has(domain)) {
    console.log("app middleware");
    return AppMiddleware(req);
  }

  // for API
  if (API_HOSTNAMES.has(domain)) {
    console.log("api middleware");
    return ApiMiddleware(req);
  }

  // default redirects for dub.sh
  if (
    domain === env.NEXT_PUBLIC_APP_DOMAIN &&
    DEFAULT_REDIRECTS[key as keyof typeof DEFAULT_REDIRECTS]
  ) {
    console.log("default redirect");
    return NextResponse.redirect(
      DEFAULT_REDIRECTS[key as keyof typeof DEFAULT_REDIRECTS],
    );
  }

  if (isValidUrl(fullKey)) {
    console.log("link middleware");
    return CreateLinkMiddleware(req);
  }

  console.log("link middleware");
  return LinkMiddleware(req);
}
