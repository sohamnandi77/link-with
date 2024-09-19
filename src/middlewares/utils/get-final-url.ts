import { type NextRequest } from "next/server";

// Only add query params to the final URL if they are in this list
const allowedQueryParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "ref",
];

interface GetFinalUrlProps {
  url: string;
  req: NextRequest;
}

export const getFinalUrl = (props: GetFinalUrlProps) => {
  const { url, req } = props;
  // query is the query string (e.g. d.to/github?utm_source=twitter -> ?utm_source=twitter)
  const searchParams = req.nextUrl.searchParams;

  // get the query params of the target url
  const urlObj = new URL(url);

  // if there are no query params, then return the target url as is (no need to parse it)
  if (searchParams.size === 0) return urlObj.toString();

  // if searchParams (type: `URLSearchParams`) has the same key as target url, then overwrite it
  for (const [key, value] of searchParams) {
    urlObj.searchParams.set(key, value);
  }

  if (urlObj.searchParams.get("qr") === "1") {
    // remove qr param from the final url if the value is "1" (only used for detectQr function)
    urlObj.searchParams.delete("qr");
  }

  return urlObj.toString();
};

interface GetDeeplinkUrlProps {
  req: NextRequest;
  route: string;
  storeUrl?: string;
  deeplink?: string;
  collectAnalytics?: boolean;
  url?: string;
}

export const getDeeplinkUrl = (props: GetDeeplinkUrlProps) => {
  const { route, req, storeUrl, deeplink, collectAnalytics, url } = props;
  const urlObj = new URL(route, req.url);
  if (url) {
    urlObj.searchParams.set("url", url);
  }
  if (deeplink) {
    urlObj.searchParams.set("deeplink", deeplink);
  }
  if (storeUrl) {
    urlObj.searchParams.set("store", storeUrl);
  }
  if (collectAnalytics) {
    urlObj.searchParams.set("analytics", `${collectAnalytics}`);
  }

  return urlObj;
};

// Get final cleaned url for storing in TB
export const getFinalUrlForRecordClick = ({
  req,
  url,
}: {
  req: NextRequest;
  url: string;
}) => {
  const searchParams = req.nextUrl.searchParams;
  const urlObj = new URL(url);

  // Filter out query params that are not in the allowed list
  if (searchParams.size > 0) {
    for (const [key, value] of searchParams) {
      if (allowedQueryParams.includes(key)) {
        urlObj.searchParams.set(key, value);
      }
    }
  }

  return urlObj.toString();
};
