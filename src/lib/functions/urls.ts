export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getUrlFromString = (str: string) => {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch {}
  return str;
};

export const getSearchParams = (url: string) => {
  // Create a params object
  const params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export const getSearchParamsWithArray = (url: string) => {
  const params = {} as Record<string, string | string[]>;

  new URL(url).searchParams.forEach((val, key) => {
    if (val) {
      if (key in params) {
        const param = params[key];
        if (Array.isArray(param)) {
          param.push(val);
        } else {
          params[key] = [param!, val];
        }
      } else {
        params[key] = val;
      }
    }
  });

  return params;
};

export const getParamsFromURL = (url: string) => {
  if (!url) return {};
  try {
    const params = new URL(url).searchParams;
    const paramsObj: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      if (value && value !== "") {
        paramsObj[key] = value;
      }
    }
    return paramsObj;
  } catch {
    return {};
  }
};

export const constructURLFromUTMParams = (
  url: string,
  utmParams: Record<string, string>,
) => {
  if (!url) return "";
  try {
    const newURL = new URL(url);
    for (const [key, value] of Object.entries(utmParams)) {
      if (value === "") {
        newURL.searchParams.delete(key);
      } else {
        newURL.searchParams.set(key, value);
      }
    }
    return newURL.toString();
  } catch {
    return "";
  }
};

export const paramsMetadata = [
  { display: "UTM Source", key: "utmSource", examples: "twitter, facebook" },
  { display: "UTM Medium", key: "utmMedium", examples: "social, email" },
  { display: "UTM Campaign", key: "utmCampaign", examples: "summer_sale" },
  { display: "UTM Term", key: "utmTerm", examples: "blue_shoes" },
  { display: "UTM Content", key: "utmContent", examples: "logolink" },
  {
    display: "Referral (ref)",
    key: "utmReferral",
    examples: "twitter, facebook",
  },
];

export const getUrlWithoutUTMParams = (url: string) => {
  try {
    const newURL = new URL(url);
    paramsMetadata.forEach((param) => newURL.searchParams.delete(param.key));
    return newURL.toString();
  } catch {
    return url;
  }
};

export const getPrettyUrl = (url: string) => {
  return url.replace(/(^\w+:|^)\/\//, "").replace("www.", "");
};
