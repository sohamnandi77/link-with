import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/widgets/file-upload";
import { useState } from "react";

const WorkspaceLogoForm = () => {
  const [image, setImage] = useState<string | null>();
  const [uploading, setUploading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        setUploading(true);
      }}
    >
      <div className="max-w-[600px] rounded-xl border border-[#E6E6E6] p-6">
        <div className="text-base font-semibold">Workspace Logo</div>
        <p className="text-sm text-[#909090]">
          This is your workspace&apos;s logo
        </p>
        <FileUpload
          accept="images"
          className="h-24 w-24 rounded-full border border-gray-300"
          iconClassName="w-5 h-5"
          variant="plain"
          imageSrc={image}
          readFile
          onChange={({ src }) => setImage(src)}
          content={null}
          maxFileSizeMB={2}
        />
        <p className="mt-3 text-sm text-gray-500">
          Square image recommended. Accepted file types: .png, .jpg. Max file
          size: 2MB.
        </p>
        <div className="mt-8 flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </div>
    </form>
  );
};

export default WorkspaceLogoForm;
