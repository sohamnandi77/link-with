import { env } from "@/env";

export const DEFAULT_DOMAINS = [
  {
    slug: env.NEXT_PUBLIC_APP_DOMAIN,
  },
] as const;

export const APP_HEADERS = {};

export const TOKEN_PREFIX = "lw_";

export const PASSWORD_RESET_TOKEN_EXPIRY = 1 * 60 * 60; // 1 hour

export const FREE_WORKSPACES_LIMIT = 5;

export const MAX_LOGIN_ATTEMPTS = 10;
