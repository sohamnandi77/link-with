import { env } from "@/env";

export const SHORT_DOMAIN = env.NEXT_PUBLIC_APP_SHORT_DOMAIN;

export const HOME_DOMAIN = `https://${env.NEXT_PUBLIC_APP_DOMAIN}`;

export const APP_HOSTNAMES = new Set([
  `app.${env.NEXT_PUBLIC_APP_DOMAIN}`,
  "localhost:3000",
  "localhost",
]);

export const API_HOSTNAMES = new Set([
  `api.${env.NEXT_PUBLIC_APP_DOMAIN}`,
  "api.localhost:3000",
]);

export const APP_DOMAIN_ROUTE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${env.NEXT_PUBLIC_APP_DOMAIN}`;

export const API_DOMAIN_ROUTE =
  process.env.NODE_ENV === "development"
    ? "http://api.localhost:3000"
    : `https://api.${env.NEXT_PUBLIC_APP_DOMAIN}`;

export const DEFAULT_REDIRECTS = {
  home: `${APP_DOMAIN_ROUTE}`,
  signin: `${APP_DOMAIN_ROUTE}/login`,
  login: `${APP_DOMAIN_ROUTE}/login`,
  register: `${APP_DOMAIN_ROUTE}/register`,
  signup: `${APP_DOMAIN_ROUTE}/register`,
  app: `${APP_DOMAIN_ROUTE}`,
  dashboard: `${APP_DOMAIN_ROUTE}`,
  settings: `${APP_DOMAIN_ROUTE}/settings`,
} as const;
