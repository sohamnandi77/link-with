"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/widgets/file-upload";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/widgets/responsive-dialog";
import { createWorkspaceSchema } from "@/schema/workspaces";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "@sindresorhus/slugify";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

const CreateWorkspaceCard = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
  });
  const { update } = useSession();

  async function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    try {
      await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      await update();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <ResponsiveDialog>
        <ResponsiveDialogTrigger className="w-full">
          {children}
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Create workspace</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <ResponsiveDialogBody>
                <div className="text-base">Workspace Logo</div>
                <p className="text-sm text-[#909090]">
                  Accepted file types: .png, .jpg. Max file size: 2MB.
                </p>
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field: { value, onChange } }) => {
                    return (
                      <FileUpload
                        accept="images"
                        className="mt-5 size-24 rounded-full border border-gray-300"
                        iconClassName="w-5 h-5"
                        variant="plain"
                        imageSrc={value}
                        readFile
                        onChange={({ src }) => onChange(src)}
                        content={null}
                        maxFileSizeMB={2}
                        accessibilityLabel="Workspace logo upload"
                      />
                    );
                  }}
                />
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex flex-col space-y-1">
                          <div className="text-base">Workspace name</div>
                          <div className="text-sm font-normal text-[#909090]">
                            The name that will appear
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your workspace name"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              form.setValue("slug", slugify(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex flex-col space-y-1">
                          <div className="text-base">Workspace Slug</div>
                          <div className="text-sm font-normal text-[#909090]">
                            This is your workspace&apos;s unique slug
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your workspace slug"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ResponsiveDialogBody>
              <ResponsiveDialogFooter className="mt-8">
                <Button>Create Workspace</Button>
              </ResponsiveDialogFooter>
            </form>
          </Form>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
};

export default CreateWorkspaceCard;
