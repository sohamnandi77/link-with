import { APP_HEADERS } from "@/constants/client-config";

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
