"use client";
import { MaxWidthWrapper } from "@/components/widgets/max-width-wrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const SETTINGS = [
  {
    id: "general",
    name: "General",
    href: "/general",
  },
  {
    id: "domains",
    name: "Domains",
    href: "/domains",
  },
  {
    id: "tags",
    name: "Tags",
    href: "/tags",
  },
  {
    id: "billing",
    name: "Billing",
    href: "/billing",
  },
  {
    id: "members",
    name: "Members",
    href: "/members",
  },
  {
    id: "api-keys",
    name: "API Keys",
    href: "/api-keys",
  },
];

const WorkspaceSettingsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { slug } = useParams();
  const pathname = usePathname();

  console.log(pathname);

  return (
    <MaxWidthWrapper className="my-10">
      <div className="rounded-xl bg-white p-6">
        <div className="flex flex-col">
          <h1 className="text-2xl">Workspaces Settings</h1>
        </div>
        <div className="mt-8 grid grid-cols-5 gap-x-9">
          <div className="sticky top-10 max-h-[600px] overflow-y-auto">
            <div className="rounded-xl border border-[#E6E6E6] bg-white p-3">
              <ul className="space-y-2">
                {SETTINGS.map(({ id, name, href }) => {
                  const newHref = slug
                    ? `/${slug as string}/settings${href}`
                    : "/";
                  const isActive = newHref === pathname;
                  console.log(isActive);
                  return (
                    <li
                      key={id}
                      className={cn(
                        "rounded-lg px-4 py-3",
                        isActive ? "bg-[#FAF5FF]" : "",
                      )}
                    >
                      <Link
                        href={newHref}
                        className={cn(
                          "font-semibold text-[#333333] hover:text-[#333333]",
                        )}
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="col-span-4 min-h-screen overflow-y-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
            {children}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default WorkspaceSettingsLayout;
