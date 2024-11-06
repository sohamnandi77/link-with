import LinkDetails from "@/features/link-details/components/link-details";

const LinkDetailPage = ({
  params,
}: {
  params: { linkId: string; slug: string };
}) => {
  return <LinkDetails params={params} />;
};

export default LinkDetailPage;
