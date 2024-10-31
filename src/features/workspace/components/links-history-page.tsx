import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import CreateLinkButton from "./create-link-button";
import LinksList from "./links-list";

const LinkHistoryPage = () => {
  return (
    <MaxWidthWrapper className="my-10">
      <div className="grid grid-cols-4 gap-x-9">
        <div className="col-span-3 min-h-screen space-y-8 overflow-y-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold">Link History</div>
            <div>
              <CreateLinkButton />
            </div>
          </div>
          <LinksList />
        </div>
        <div className="sticky top-10 max-h-[600px] overflow-y-auto">
          <div className="rounded-xl border border-[#E6E6E6] bg-white p-5">
            <div>Quick Shortner</div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default LinkHistoryPage;
