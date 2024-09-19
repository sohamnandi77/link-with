import { APPS } from "../apps-config";
import { getFacebookUriScheme } from "./facebook";
import { getYoutubeUriScheme } from "./youtube";

export const UriScheme: Record<string, (url: URL) => string> = {
  [APPS.FACEBOOK.DOMAIN]: getFacebookUriScheme,
  [APPS.YOUTUBE.DOMAIN]: getYoutubeUriScheme,
  [APPS.YOUTU_BE.DOMAIN]: getYoutubeUriScheme,
};
