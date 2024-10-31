import Providers from "@/app/providers";
import { MainNav } from "@/components/main-nav";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import WorkspaceSwitcher from "@/components/workspace-switcher";
import { getSession } from "@/lib/auth/utils";
import { constructMetadata } from "@/lib/functions/construct-metadata";
import { type ReactNode } from "react";

export const metadata = constructMetadata();

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <Providers>
      <div className="w-full">
        <div className="sticky -top-16 z-20 border-b border-gray-200">
          <MaxWidthWrapper>
            <MainNav>
              <WorkspaceSwitcher user={session?.user} />
            </MainNav>
          </MaxWidthWrapper>
        </div>
        {children}
      </div>
    </Providers>
  );
}
