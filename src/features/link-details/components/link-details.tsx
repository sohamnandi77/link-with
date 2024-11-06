import { MaxWidthWrapper } from "@/components/widgets/max-width-wrapper";
import LinkAnalyticsCardWrapper from "./link-analytics-card-wrapper";
import LinkDetailsCardWrapper from "./link-details-card-wrapper";

const LinkDetails = (props: { params: { linkId: string; slug: string } }) => {
  const { linkId, slug } = props.params;
  return (
    <MaxWidthWrapper className="my-10 space-y-6">
      <LinkDetailsCardWrapper linkId={linkId} slug={slug} />
      <LinkAnalyticsCardWrapper />
    </MaxWidthWrapper>
  );
};

export default LinkDetails;
