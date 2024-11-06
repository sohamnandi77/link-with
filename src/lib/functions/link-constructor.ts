import { punycode } from "@/lib/vendors/punycode";

export function linkConstructor({
  domain,
  keyword,
  pretty,
  searchParams,
}: {
  domain?: string;
  keyword?: string;
  pretty?: boolean;
  searchParams?: Record<string, string>;
}) {
  if (!domain) {
    return "";
  }

  let url = `https://${punycode(domain)}${keyword && keyword !== "_root" ? `/${punycode(keyword)}` : ""}`;

  if (searchParams) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      search.set(key, value);
    }
    url += `?${search.toString()}`;
  }

  return pretty ? url.replace(/^https?:\/\//, "") : url;
}
