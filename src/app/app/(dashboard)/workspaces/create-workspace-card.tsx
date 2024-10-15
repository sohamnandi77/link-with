import { Plus } from "lucide-react";

const CreateWorkspaceCard = () => {
  return (
    <div className="flex h-[440px] w-[292px] items-center justify-center rounded-xl border border-dashed border-[#E9D5FF] bg-[#FAF5FF]">
      <div className="flex flex-col items-center justify-center space-y-7">
        <Plus className="size-12" />
        <span className="font-semibold">Add Workspace</span>
      </div>
    </div>
  );
};

export default CreateWorkspaceCard;
