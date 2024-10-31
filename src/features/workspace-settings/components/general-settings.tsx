"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateWorkspaceSchema } from "@/schema/workspaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import DeleteWorkspace from "./delete-workspace";
import WorkspaceLogoForm from "./workspace-logo-form";

const GeneralSettingsPage = () => {
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    console.log(values);
  };

  return (
    <div className="space-y-7">
      <div className="text-2xl font-semibold">General Settings</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-[600px] rounded-xl border border-[#E6E6E6] p-6">
            <div className="text-base font-semibold">Workspace name</div>
            <p className="text-sm text-[#909090]">The name that will appear</p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormControl>
                    <Input placeholder="Workspace name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-8 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </Form>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-[600px] rounded-xl border border-[#E6E6E6] p-6">
            <div className="text-base font-semibold">Workspace Slug</div>
            <p className="text-sm text-[#909090]">
              This is your workspace&apos;s unique slug
            </p>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormControl>
                    <Input placeholder="Workspace slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-8 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </Form>
      <WorkspaceLogoForm />
      <DeleteWorkspace />
    </div>
  );
};

export default GeneralSettingsPage;
