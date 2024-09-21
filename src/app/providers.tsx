"use client";

// import { PosthogPageview } from "@/components/layout/posthog-pageview";
// import { env } from "@/env";
import { SessionProvider } from "next-auth/react";
// import posthog from "posthog-js";
// import { PostHogProvider } from "posthog-js/react";
import { type ReactNode } from "react";

// if (typeof window !== "undefined") {
//   posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
//     person_profiles: "identified_only",
//     capture_pageview: false, // Disable automatic pageview capture, as we capture manually
//     capture_pageleave: true, // Enable pageleave capture
//     // loaded: (posthog) => {
//     //   if (env.NODE_ENV === "development") posthog.debug(); // debug mode in development
//     // },
//   });
// }

export default function Providers({ children }: { children: ReactNode }) {
  return (
    // <PostHogProvider client={posthog}>
    <SessionProvider>
      {/* <PosthogPageview /> */}
      {children}
    </SessionProvider>
    // </PostHogProvider>
  );
}
