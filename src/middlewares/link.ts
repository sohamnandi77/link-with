import { NextResponse, userAgent, type NextRequest } from "next/server";

import { isDefaultDomain } from "@/lib/functions/domains";
import { punyEncode } from "@/lib/vendors/punycode";
import { detectBot } from "@/middlewares/utils/detect-bot";
import { getFinalUrl } from "@/middlewares/utils/get-final-url";
import { getHeaders } from "@/middlewares/utils/get-headers";
import { getLinkViaEdge } from "@/middlewares/utils/get-link-via-edge";
import { isSupportedDeeplinkProtocol } from "@/middlewares/utils/is-supported-deeplink-protocol";
import { parse } from "@/middlewares/utils/parse";
import AndroidMiddleware from "./android";
import IosMiddleware from "./ios";
import WebMiddleware from "./web";

export default async function LinkMiddleware(req: NextRequest) {
  const { domain, fullKey: originalKey } = parse(req);

  if (!domain) {
    return NextResponse.next();
  }

  // encode the key to ascii
  // links are case insensitive by default
  let key = punyEncode(originalKey?.toLowerCase());

  // if key is empty string, set to _root (root domain link)
  if (key === "") {
    key = "_root";
  }

  const link = await getLinkViaEdge(domain, key);

  if (!link) {
    // short link not found, redirect to root
    return NextResponse.redirect(new URL("/", req.url), {
      ...getHeaders(false),
      status: 302,
    });
  }

  const {
    originalLink: url,
    password,
    proxy,
    cloaked,
    iframeable,
    expiredLinkByDate,
    ios,
    android,
    geo,
    expiredLink,
    banned,
    collectAnalytics,
    shouldIndex: isIndexed,
  } = link;

  // by default, we only index default dub domain links (e.g. dub.sh)
  // everything else is not indexed by default, unless the user has explicitly set it to be indexed
  const shouldIndex = isDefaultDomain(domain) ?? isIndexed;

  // if the link is password protected
  if (password) {
    const pw = req.nextUrl.searchParams.get("pw");

    // rewrite to auth page (/password/[domain]/[key]) if:
    // - no `pw` param is provided
    // - the `pw` param is incorrect
    // this will also ensure that no clicks are tracked unless the password is correct
    if (!pw || (await getLinkViaEdge(domain, key))?.password !== pw) {
      return NextResponse.rewrite(
        new URL(`/password/${domain}/${encodeURIComponent(key)}`, req.url),
        {
          ...getHeaders(shouldIndex),
        },
      );
    } else if (pw) {
      // strip it from the URL if it's correct
      req.nextUrl.searchParams.delete("pw");
    }
  }

  // if the link is banned
  if (banned) {
    return NextResponse.rewrite(new URL("/banned", req.url), {
      ...getHeaders(shouldIndex),
    });
  }

  // if the link has expired
  if (expiredLinkByDate && new Date(expiredLinkByDate) < new Date()) {
    if (expiredLink) {
      return NextResponse.redirect(expiredLink, {
        ...getHeaders(shouldIndex),
      });
    } else {
      return NextResponse.rewrite(new URL(`/expired/${domain}`, req.url), {
        ...getHeaders(shouldIndex),
      });
    }
  }

  // for root domain links, if there's no destination URL, rewrite to placeholder page
  if (!url) {
    return NextResponse.rewrite(new URL(`/${domain}`, req.url), {
      ...getHeaders(shouldIndex),
    });
  }

  const isBot = detectBot(req);

  const { country } = process.env.VERCEL === "1" && req.geo ? req.geo : {};

  // rewrite to proxy page (/proxy/[domain]/[key]) if it's a bot and proxy is enabled
  if (isBot && proxy) {
    return NextResponse.rewrite(
      new URL(`/proxy/${domain}/${encodeURIComponent(key)}`, req.url),
      {
        ...getHeaders(shouldIndex),
      },
    );
  }

  // rewrite to deeplink page if the link is a mailto: or tel:
  if (isSupportedDeeplinkProtocol(url)) {
    return NextResponse.rewrite(
      new URL(
        `/deeplink/${encodeURIComponent(getFinalUrl({ url, req }))}`,
        req.url,
      ),
      {
        ...getHeaders(shouldIndex),
      },
    );
  }

  // rewrite to target URL if link cloaking is enabled
  if (cloaked) {
    if (iframeable) {
      return NextResponse.rewrite(
        new URL(
          `/cloaked/${encodeURIComponent(getFinalUrl({ url, req }))}`,
          req.url,
        ),
        {
          ...getHeaders(shouldIndex),
        },
      );
    } else {
      // if link is not iframeable, use Next.js rewrite instead
      return NextResponse.rewrite(url, {
        ...getHeaders(shouldIndex),
      });
    }
  }

  // redirect to geo-specific link if it is specified and the user is in the specified country
  if (geo && country) {
    return NextResponse.redirect(
      getFinalUrl({
        url: geo[country as keyof typeof geo],
        req,
      }),
      {
        ...getHeaders(shouldIndex),
        status: key === "_root" ? 301 : 302,
      },
    );
  }

  // redirect to iOS link if it is specified and the user is on an iOS device
  if (userAgent(req).os?.name === "iOS") {
    // iosMiddleware
    return IosMiddleware({
      url,
      req,
      collectAnalytics,
      ios,
      key,
      shouldIndex,
    });
  }

  // redirect to Android link if it is specified and the user is on an Android device
  if (userAgent(req).os?.name === "Android") {
    // androidMiddleware
    return AndroidMiddleware({
      url,
      req,
      collectAnalytics,
      android,
      key,
      shouldIndex,
    });
  }

  // regular redirect
  return WebMiddleware({
    req,
    url,
    key,
    shouldIndex,
    collectAnalytics,
  });
}
