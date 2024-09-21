import { LOCALHOST_SHORT_DOMAIN, SHORT_DOMAIN } from "@/constants/config";
import { type MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  let domain = headersList.get("host")!;

  if (domain === LOCALHOST_SHORT_DOMAIN || domain.endsWith(".vercel.app")) {
    // for local development and preview URLs
    domain = SHORT_DOMAIN;
  }

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
  ];
}
