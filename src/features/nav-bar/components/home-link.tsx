"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const HomeLink = () => {
  const { slug } = useParams();

  return (
    <Link href={`/${slug?.toString() ?? ""}`} className="text-black">
      Go to App
    </Link>
  );
};

export default HomeLink;
