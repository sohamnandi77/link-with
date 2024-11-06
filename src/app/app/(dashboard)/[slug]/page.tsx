import LinkHistoryPage from "@/features/workspace/components/links-history-page";

const Workspace = ({ params }: { params: { slug: string } }) => {
  return <LinkHistoryPage slug={params.slug} />;
};

export default Workspace;
