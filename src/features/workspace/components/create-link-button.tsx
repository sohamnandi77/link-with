"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CreateLinkButton = () => {
  const { slug } = useParams();

  console.log(slug);
  return (
    <Link href={`/${slug as string}/create-link`}>
      <Button>
        <Plus className="h-4 w-4" />
        <span>Create Smart Link</span>
      </Button>
    </Link>
  );
};

export default CreateLinkButton;
