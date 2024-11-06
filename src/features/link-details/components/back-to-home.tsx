"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useParams } from "next/navigation";

const BackToHome = () => {
  const params = useParams();

  return (
    <Link href={`/${params.slug as string}`}>
      <ArrowLeftIcon className="size-6 cursor-pointer" />
    </Link>
  );
};

export default BackToHome;
