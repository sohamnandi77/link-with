import { getQueryClient } from "@/lib/api/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { linkOptions } from "../api/use-link-details";
import BackToHome from "./back-to-home";
import LinkDetailsCard from "./link-details-card";

const LinkDetailsCardWrapper = ({
  linkId,
  slug,
}: {
  slug: string;
  linkId: string;
}) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(linkOptions(linkId, slug));
  return (
    <div className="rounded-xl border border-[#E6E6E6] bg-white p-5">
      <div className="flex items-center">
        <BackToHome />
        <div className="ml-3 text-2xl font-semibold">Link Details</div>
      </div>
      <div className="mt-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <LinkDetailsCard linkId={linkId} slug={slug} />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default LinkDetailsCardWrapper;
