import { type NextRequest, NextResponse } from "next/server";

import { APP_DOMAIN_ROUTE } from "@/constants/config";
import { getUrlFromString } from "@/lib/functions/urls";
import { parse } from "@/middlewares/utils/parse";

export default function CreateLinkMiddleware(req: NextRequest) {
  const { domain, fullPath } = parse(req);

  const url = getUrlFromString(fullPath.slice(1));

  const redirectURL = new URL(`${APP_DOMAIN_ROUTE}/new`);
  redirectURL.searchParams.append("link", url);
  redirectURL.searchParams.append("domain", domain);

  return NextResponse.redirect(redirectURL.toString());
}
