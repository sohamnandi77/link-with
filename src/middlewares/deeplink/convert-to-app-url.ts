import { isValidUrl } from "@/lib/functions/urls";
import { APPS, DOMAIN_REGEX_MAP } from "./apps-config";
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
  const domain = urlObj.hostname.replace("www.", "").toLowerCase();

  let appKey: keyof typeof APPS | undefined;

  // Find the appKey by matching the domain with the regular expressions in DOMAIN_REGEX_MAP
  for (const [key, regex] of DOMAIN_REGEX_MAP) {
    if (regex.test(domain)) {
      appKey = key;
      break;
    }
  }

  // If the domain matches an app, generate Android URLs
  if (appKey && appKey in APPS) {
    const apps = APPS[appKey];

    return {
      android: getChromeIntentUrl(urlObj, apps.PLAY_STORE_ID), // Chrome intent URL
      playStore: getPlayStoreUrl(apps.PLAY_STORE_ID), // Play Store URL
    };
  }

  return {};
}

export function convertToIosAppUrl(url: string): AppUrl {
  if (!isValidUrl(url)) return {};
  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace("www.", "").toLowerCase();

  let appKey: keyof typeof APPS | undefined;

  // Find the appKey by checking if the domain matches any regex in DOMAIN_REGEX_MAP
  for (const [key, regex] of DOMAIN_REGEX_MAP) {
    if (regex.test(domain)) {
      appKey = key;
      break;
    }
  }

  if (appKey && appKey in APPS && appKey in UriScheme) {
    const apps = APPS[appKey];
    const uriScheme = UriScheme[appKey]; // Fetch the corresponding URI scheme function
    if (typeof uriScheme === "function") {
      return {
        ios: uriScheme(urlObj), // Call the URI scheme function for the matched app
        appStore: getAppleStoreUrl(apps.APP_STORE_ID),
      };
    }
  }
  return {};
}
