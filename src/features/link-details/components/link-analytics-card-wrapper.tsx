import ClicksPerformance from "./clicks-performance";
import TopCardsList from "./top-cards-list";

const LinkAnalyticsCardWrapper = () => {
  return (
    <div className="space-y-8 overflow-y-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Link Analytics</div>
      </div>
      <div className="space-y-9">
        <div>Filters</div>
        <TopCardsList />
        <ClicksPerformance />
      </div>
    </div>
  );
};

export default LinkAnalyticsCardWrapper;
