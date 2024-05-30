"use client";
import MuxUploader from "@/app/(dashboard)/admin/upload/MuxUploader";
import { primaryButtonClassName } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const UploadPage = ({
  directUpload1,
  directUpload2,
}: {
  directUpload1: { url: string };
  directUpload2: { url: string };
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className="flex flex-col gap-5">
      <MuxUploader endpoint={directUpload1.url} />
      <MuxUploader endpoint={directUpload2.url} />
      <Button
        className={cn(primaryButtonClassName, "w-fit ml-auto")}
        onClick={handleRefresh}
      >
        Refresh
      </Button>
    </div>
  );
};

export default UploadPage;
