"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
// import posthog from "posthog-js";
// import { PostHogProvider } from "posthog-js/react";
import { type ReactNode } from "react";

// import { PosthogPageview } from "@/components/layout/posthog-pageview";
// import { env } from "@/env";
import { getQueryClient } from "@/lib/api/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// if (typeof window !== "undefined") {
//   posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
//     person_profiles: "identified_only",
//     capture_pageview: false, // Disable automatic pageview capture, as we capture manually
//     capture_pageleave: true, // Enable pageleave capture
//     // loaded: (posthog) => {
//     //   if (env.NODE_ENV === "development") posthog.debug(); // debug mode in development
//     // },
//   });
// }

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    // <PostHogProvider client={posthog}>
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {/* <PosthogPageview /> */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
    // </PostHogProvider>
  );
}
