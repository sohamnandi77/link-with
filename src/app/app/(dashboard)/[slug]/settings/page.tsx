"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { redirect } from "next/navigation";

const GeneralSettings = () => {
  const { isDesktop } = useMediaQuery();
  if (isDesktop) {
    redirect("/settings/general");
  }
  return null;
};

export default GeneralSettings;
