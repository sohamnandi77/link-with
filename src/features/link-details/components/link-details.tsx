import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import ClicksPerformance from "./clicks-performance";
import TopCardsList from "./top-cards-list";

const LinkDetails = () => {
  return (
    <MaxWidthWrapper className="my-10">
      <div className="grid grid-cols-3 gap-x-9">
        <div className="col-span-2 min-h-screen space-y-8 overflow-y-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold">Link Analytics</div>
          </div>
          <div className="space-y-9">
            <div>Filters</div>
            <TopCardsList />
            <ClicksPerformance />
          </div>
        </div>
        <div className="sticky top-10 max-h-[600px] overflow-y-auto">
          <div className="rounded-xl border border-[#E6E6E6] bg-white p-5">
            <div className="text-xl font-semibold">Link Details</div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default LinkDetails;
