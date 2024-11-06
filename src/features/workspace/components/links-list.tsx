"use client";
import { useWorkspace } from "../api/use-workspace";
import LinkCard from "./link-card";

type LinksListProps = {
  slug: string;
};

const LinksList = (props: LinksListProps) => {
  const { slug } = props;
  const { data } = useWorkspace(slug);

  return data?.map((link) => <LinkCard key={link.id} {...link} />);
};

export default LinksList;
