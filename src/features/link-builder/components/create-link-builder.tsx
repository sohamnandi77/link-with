"use client";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createLinkBodySchema } from "@/schema/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shuffle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { LINK_BUILDER } from "../constants";
import CustomizeLinkPreview from "./customize-link-preview";
import GeoTargeting from "./geo-targeting";
import DeviceTargeting from "./ios-targeting";
import LinkCloaking from "./link-cloaking";
import LinkExpiration from "./link-expiration";
import LinkPreview from "./link-preview";
import PasswordProtect from "./password-protect";
import SearchEngineIndexing from "./search-engine-indexing";
import UTMBuilderWrapper from "./utm-builder-wrapper";

const CreateLinkBuilder = () => {
  const params = useParams();
  const form = useForm<z.infer<typeof createLinkBodySchema>>({
    resolver: zodResolver(createLinkBodySchema),
  });
  const [mount, setMount] = useState<boolean>(false);
  const { isDesktop } = useMediaQuery();
  useEffect(() => {
    setMount(true);
  }, []);

  async function onSubmit(values: z.infer<typeof createLinkBodySchema>) {
    try {
      const res = await fetch(
        `/api/links?workspaceSlug=${params?.slug as string}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, domain: "lk.linkyatri.com" }),
        },
      );
      if (res.status === 200) {
        const data: unknown = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <MaxWidthWrapper className="my-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-x-9">
            <div className="col-span-2 min-h-screen overflow-y-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
              <div className="text-xl">Create Link</div>
              <FormField
                control={form.control}
                name="originalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Paste your link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Short Link</span>
                        <Shuffle className="size-4" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Paste your link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-6">
                <span className="text-xl">Link Customisation</span>
                <span className="ml-4 text-base text-[#909090]">
                  (optional)
                </span>
              </div>
              <Accordion type="multiple" className="w-full space-y-5">
                {mount && !isDesktop && (
                  <AccordionItem
                    value={LINK_BUILDER.ADD_TAGS.id}
                    className="rounded-xl border border-[#E6E6E6]"
                  >
                    <AccordionTrigger className="px-6 py-5 text-sm">
                      <div className="flex flex-col items-start">
                        <div className="font-semibold">
                          {LINK_BUILDER.ADD_TAGS.title}
                        </div>
                        <p className="text-[#909090]">
                          {LINK_BUILDER.ADD_TAGS.description}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6"></AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem
                  value={LINK_BUILDER.CUSTOMIZE_LINK_PREVIEW.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.CUSTOMIZE_LINK_PREVIEW.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.CUSTOMIZE_LINK_PREVIEW.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <CustomizeLinkPreview />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value={LINK_BUILDER.UTM_BUILDER.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.UTM_BUILDER.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.UTM_BUILDER.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <UTMBuilderWrapper />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value={LINK_BUILDER.PASSWORD_PROTECTION.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.PASSWORD_PROTECTION.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.PASSWORD_PROTECTION.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <PasswordProtect />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value={LINK_BUILDER.LINK_EXPIRATION.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.LINK_EXPIRATION.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.LINK_EXPIRATION.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <LinkExpiration />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value={LINK_BUILDER.DEVICE_TARGETING.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.DEVICE_TARGETING.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.DEVICE_TARGETING.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <DeviceTargeting />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value={LINK_BUILDER.GEO_TARGETING.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.GEO_TARGETING.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.GEO_TARGETING.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <GeoTargeting />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value={LINK_BUILDER.LINK_CLOAKING.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.LINK_CLOAKING.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.LINK_CLOAKING.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <LinkCloaking />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value={LINK_BUILDER.SEARCH_ENGINE_INDEXING.id}
                  className="rounded-xl border border-[#E6E6E6]"
                >
                  <AccordionTrigger className="px-6 py-5 text-sm">
                    <div className="flex flex-col items-start">
                      <div className="font-semibold">
                        {LINK_BUILDER.SEARCH_ENGINE_INDEXING.title}
                      </div>
                      <p className="text-[#909090]">
                        {LINK_BUILDER.SEARCH_ENGINE_INDEXING.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <SearchEngineIndexing />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="sticky top-10 max-h-[600px] overflow-y-auto">
              <LinkPreview />
              <div className="mt-6 rounded-xl border border-[#E6E6E6] bg-white p-5">
                Add Tags
              </div>
            </div>
          </div>
        </form>
      </Form>
    </MaxWidthWrapper>
  );
};

export default CreateLinkBuilder;
