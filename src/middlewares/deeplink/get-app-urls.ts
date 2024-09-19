import { APPS, SUPPORTED_DOMAINS } from "./apps-config";

export const getPlayStoreUrl = (playStoreId: string): string => {
  const root = "https://play.google.com";

  if (
    playStoreId ===
      APPS?.[SUPPORTED_DOMAINS.GOOGLE_PLAY_STORE]?.PLAY_STORE_ID ||
    !playStoreId
  ) {
    return root;
  }

  return `${root}/store/apps/details?id=${playStoreId}`;
};

export const getChromeIntentUrl = (
  url: URL,
  packageName: string,
): string | undefined => {
  try {
    if (!url || !packageName) return undefined;

    const hostname = url.hostname.replace("www.", "").toLowerCase();
    const pathname = url.pathname;
    const search = url.search;

    let intentUrl = `intent://`;
    if (hostname) intentUrl += hostname;
    else return undefined;
    if (pathname) intentUrl += pathname;
    if (search) intentUrl += search;
    if (packageName)
      intentUrl += `#Intent;scheme=https;package=${packageName};`;
    else return undefined;
    const fallbackUrl = url?.toString();
    if (fallbackUrl) {
      intentUrl += `S.browser_fallback_url=${decodeURIComponent(fallbackUrl)};`;
    }
    intentUrl += "end;";

    return intentUrl;
  } catch (error) {
    console.error("Error constructing Chrome Intent URL:", error);
    return undefined;
  }
};

export const getAppleStoreUrl = (appStoreId: string): string => {
  const root = "https://apps.apple.com";
  if (!appStoreId) return root;
  return `${root}/app/${appStoreId}`;
};
