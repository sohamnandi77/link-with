import { isValidUrl } from "@/lib/functions/urls";
import { APPS } from "./apps-config";
import {
  getAppleStoreUrl,
  getChromeIntentUrl,
  getPlayStoreUrl,
} from "./get-app-urls";
import { UriScheme } from "./ios";

export type AppUrl = {
  android?: string;
  ios?: string;
  playStore?: string;
  appStore?: string;
};

export function convertToAndroidAppUrl(url: string): AppUrl {
  if (!isValidUrl(url)) return {};
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const domain = hostname.replace("www.", "").toLowerCase();

  if (domain in APPS) {
    const apps = APPS[domain as keyof typeof APPS];

    return {
      android: getChromeIntentUrl(urlObj, apps.PLAY_STORE_ID),
      playStore: getPlayStoreUrl(apps.PLAY_STORE_ID),
    };
  }
  return {};
}

export function convertToIosAppUrl(url: string): AppUrl {
  if (!isValidUrl(url)) return {};
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const domain = hostname.replace("www.", "").toLowerCase();

  if (domain in APPS && domain in UriScheme) {
    const apps = APPS[domain as keyof typeof APPS];
    const uriScheme = UriScheme[domain];
    if (typeof uriScheme === "function") {
      return {
        ios: uriScheme(urlObj),
        appStore: getAppleStoreUrl(apps.APP_STORE_ID),
      };
    }
  }
  return {};
}
