import { nanoid } from "@/lib/vendors/nanoid";
import { checkIfKeywordExists } from "./check-if-keyword-exists";

export async function getRandomKey({
  domain,
  prefix,
}: {
  domain: string;
  prefix?: string;
}): Promise<string> {
  /* recursively get random key till it gets one that's available */
  let keyword = nanoid();
  if (prefix) {
    keyword = `${prefix.replace(/^\/|\/$/g, "")}/${keyword}`;
  }
  const exists = await checkIfKeywordExists(domain, keyword);
  if (exists) {
    // by the off chance that key already exists
    return getRandomKey({ domain, prefix });
  } else {
    return keyword;
  }
}
