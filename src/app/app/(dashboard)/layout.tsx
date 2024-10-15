import Providers from "@/app/providers";
import { MainNav } from "@/components/main-nav";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import WorkspaceSwitcher from "@/components/workspace-switcher";
import { constructMetadata } from "@/lib/functions/construct-metadata";
import { type ReactNode } from "react";

export const metadata = constructMetadata();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen w-full">
        <div className="sticky -top-16 z-20 border-b border-gray-200 bg-white">
          <MaxWidthWrapper>
            <MainNav>
              <WorkspaceSwitcher />
            </MainNav>
          </MaxWidthWrapper>
        </div>
        {children}
      </div>
    </Providers>
  );
}
