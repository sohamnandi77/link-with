import { Button } from "@/components/ui/button";

const DeleteWorkspace = () => {
  return (
    <div className="max-w-[600px] rounded-xl border border-red-500 p-6">
      <div className="text-base font-semibold">Delete Workspace</div>
      <p className="text-sm text-[#909090]">
        Permanently delete your workspace, custom domain, and all associated
        links with their stats. This action cannot be undone - please proceed
        with caution.
      </p>
      <div className="mt-8 flex justify-end">
        <Button className="bg-red-500">Delete Workspace</Button>
      </div>
    </div>
  );
};

export default DeleteWorkspace;
