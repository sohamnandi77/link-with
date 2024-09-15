import { ccTLDs } from "@/constants/cctlds";
import { DEFAULT_DOMAINS } from "@/constants/config";
import { SECOND_LEVEL_DOMAINS, SPECIAL_APEX_DOMAINS } from "@/constants/domain";
import slugify from "@sindresorhus/slugify";
import { isValidUrl } from "./urls";

export const generateDomainFromName = (name: string) => {
  const normalizedName = slugify(name, { separator: "" });
  if (normalizedName.length < 3) {
    return "";
  }
  if (ccTLDs.has(normalizedName.slice(-2))) {
    return `${normalizedName.slice(0, -2)}.${normalizedName.slice(-2)}`;
  }
  // remove vowels
  const devowel = normalizedName.replace(/[aeiou]/g, "");
  if (devowel.length >= 3 && ccTLDs.has(devowel.slice(-2))) {
    return `${devowel.slice(0, -2)}.${devowel.slice(-2)}`;
  }

  const shortestString = [normalizedName, devowel].reduce((a, b) =>
    a.length < b.length ? a : b,
  );

  return `${shortestString}.link`;
};

export const VALID_DOMAIN_REGEX = new RegExp(
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
);

export const VALID_KEY_REGEX = new RegExp(
  /^[0-9A-Za-z_\u0080-\uFFFF\/\-\p{Emoji}]*$/u,
);

export const VALID_SLUG_REGEX = new RegExp(/^[a-zA-Z0-9\-]+$/);

export const getSubdomain = (name: string, apexName: string) => {
  if (name === apexName) return null;
  return name.slice(0, name.length - apexName.length - 1);
};

export const getApexDomain = (url: string) => {
  let domain;
  try {
    // replace any custom scheme (e.g. notion://) with https://
    // use the URL constructor to get the hostname
    domain = new URL(url.replace(/^[a-zA-Z]+:\/\//, "https://")).hostname;
  } catch {
    return "";
  }
  if (domain === "youtu.be") return "youtube.com";
  if (domain === "raw.githubusercontent.com") return "github.com";
  if (domain.endsWith(".vercel.app")) return "vercel.app";

  const parts = domain.split(".");
  if (parts.length > 2) {
    const secondLastPart = parts[parts.length - 2];
    const lastPart = parts[parts.length - 1];
    if (
      // if this is a second-level TLD (e.g. co.uk, .com.ua, .org.tt), we need to return the last 3 parts
      (secondLastPart &&
        lastPart &&
        SECOND_LEVEL_DOMAINS.has(secondLastPart) &&
        ccTLDs.has(lastPart)) ||
      // if it's a special subdomain for website builders (e.g. weathergpt.vercel.app/)
      SPECIAL_APEX_DOMAINS.has(parts.slice(-2).join("."))
    ) {
      return parts.slice(-3).join(".");
    }
    // otherwise, it's a subdomain (e.g. dub.vercel.app), so we return the last 2 parts
    return parts.slice(-2).join(".");
  }
  // if it's a normal domain (e.g. dub.co), we return the domain
  return domain;
};
export const getDomainWithoutWWW = (url: string) => {
  if (isValidUrl(url)) {
    return new URL(url).hostname.replace(/^www\./, "");
  }
  try {
    if (url.includes(".") && !url.includes(" ")) {
      return new URL(`https://${url}`).hostname.replace(/^www\./, "");
    }
  } catch {
    return null;
  }
};

export const isDefaultDomain = (domain: string) => {
  return DEFAULT_DOMAINS.some((d) => d.slug === domain);
};
