import { APP_HEADERS } from "@/constants/config";

export const getHeaders = (shouldIndex: boolean) => {
  return {
    headers: {
      ...APP_HEADERS,
      ...(!shouldIndex && {
        "X-Robots-Tag": "googlebot: noindex",
      }),
    },
  };
};
