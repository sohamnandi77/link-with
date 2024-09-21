import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KeyboardShortcutProvider } from "@/hooks/use-keyboard-shortcut";
import { constructMetadata } from "@/lib/functions/construct-metadata";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";

import "@/styles/globals.css";
import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(montserrat.variable)}>
      <body>
        <TooltipProvider>
          <KeyboardShortcutProvider>
            <Toaster closeButton className="pointer-events-auto" />
            {children}
          </KeyboardShortcutProvider>
        </TooltipProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
