"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function MainNav({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();

  return (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center">
        <Link href={`/${slug?.toString() ?? ""}`} className="text-black">
          Link With
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
