import punycodeHelper from "punycode/";

export const punycode = (str?: string | null) => {
  if (typeof str !== "string") return "";
  try {
    return punycodeHelper.toUnicode(str);
  } catch {
    return str;
  }
};

export const punyEncode = (str?: string | null) => {
  if (typeof str !== "string") return "";
  return punycodeHelper.toASCII(str);
};
