import { Input } from "@/components/ui/input";
import { MaxWidthWrapper } from "@/components/widgets/max-width-wrapper";
import { getQueryClient } from "@/lib/api/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { workspaceOptions } from "../api/use-workspace";
import CreateLinkButton from "./create-link-button";
import LinksList from "./links-list";

const LinkHistoryPage = (props: { slug: string }) => {
  const { slug } = props;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(workspaceOptions(slug));

  return (
    <MaxWidthWrapper className="my-10 space-y-9">
      <div className="rounded-xl border border-[#E6E6E6] bg-white p-5">
        <div>Quick Shortner</div>
        <Input placeholder="Enter a link here" />
      </div>
      <div className="min-h-screen space-y-8 overflow-y-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold">Link History</div>
          <div>
            <CreateLinkButton />
          </div>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <LinksList slug={slug} />
        </HydrationBoundary>
      </div>
    </MaxWidthWrapper>
  );
};

export default LinkHistoryPage;
