import { ConfirmDialog } from "@/shared/components/common";
import { Trash2 } from "lucide-react";
import { FeedbackRow } from "../../../types";

interface FeedbackDeleteDialogProps {
  pendingFeedback: FeedbackRow | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function FeedbackDeleteDialog({
  pendingFeedback,
  isDeleting,
  onConfirm,
  onCancel,
}: FeedbackDeleteDialogProps) {
  return (
    <ConfirmDialog
      isOpen={Boolean(pendingFeedback)}
      icon={Trash2}
      title="Xoá góp ý này?"
      description={
        <>
          Góp ý của{" "}
          <span className="font-medium text-foreground">
            {pendingFeedback?.userName}
          </span>{" "}
          sẽ bị xoá vĩnh viễn, không khôi phục được.
        </>
      }
      confirmLabel="Xoá góp ý"
      isConfirming={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
