import { SUPPORTED_DOMAINS } from "../apps-config";
import { getFacebookUriScheme } from "./facebook";
import { getInstagramUriScheme } from "./instagram";
import { getYoutubeUriScheme } from "./youtube";

export const UriScheme: Record<string, (url: URL) => string> = {
  [SUPPORTED_DOMAINS.FACEBOOK]: getFacebookUriScheme,
  [SUPPORTED_DOMAINS.YOUTUBE]: getYoutubeUriScheme,
  [SUPPORTED_DOMAINS.INSTAGRAM]: getInstagramUriScheme,
};
