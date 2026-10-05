import { Trash2, TriangleAlert } from "lucide-react";
import { useRef } from "react";
import type { PendingContentAction } from "../types";
import { ConfirmDialog } from "@/shared/components/common";

export interface ContentConfirmDialogProps {
  pendingAction: PendingContentAction | null;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmCopy {
  icon: typeof Trash2;
  title: string;
  confirmLabel: string;
  cancelLabel?: string;
  description: React.ReactNode;
}

function getLectureLessonText(lessonCount: number) {
  if (lessonCount === 0) return " sẽ bị xoá khỏi khóa học.";

  return ` cùng ${lessonCount} bài học bên trong sẽ bị xoá khỏi khóa học.`;
}

// Tên đối tượng đậm, phần còn lại của câu xám: liếc là biết đang xoá đúng cái
function getConfirmCopy(action: PendingContentAction | null): ConfirmCopy {
  if (action?.kind === "delete-lecture") {
    return {
      icon: Trash2,
      title: "Xoá chương?",
      confirmLabel: "Xoá chương",
      description: (
        <p>
          <span className="font-medium text-foreground">{action.title}</span>
          {getLectureLessonText(action.lessonCount)}
        </p>
      ),
    };
  }

  if (action?.kind === "discard-changes") {
    return {
      icon: TriangleAlert,
      title: "Bỏ thay đổi chưa lưu?",
      confirmLabel: "Bỏ thay đổi",
      cancelLabel: "Ở lại",
      description: (
        <p>
          Bài{" "}
          <span className="font-medium text-foreground">
            {action.currentTitle}
          </span>{" "}
          có thay đổi chưa lưu. Chuyển sang bài khác thì các thay đổi này sẽ
          mất.
        </p>
      ),
    };
  }

  return {
    icon: Trash2,
    title: "Xoá bài học?",
    confirmLabel: "Xoá bài học",
    description: (
      <p>
        <span className="font-medium text-foreground">
          {action?.kind === "delete-lesson" ? action.title : ""}
        </span>{" "}
        sẽ bị xoá khỏi khóa học.
      </p>
    ),
  };
}

export function ContentConfirmDialog({
  pendingAction,
  isConfirming,
  onConfirm,
  onCancel,
}: ContentConfirmDialogProps) {
  // Lúc đóng, pendingAction về null ngay mà hộp còn chạy chuyển động 100ms:
  // giữ việc cuối cùng để chữ trong hộp không nhảy sang nội dung khác
  const lastActionRef = useRef(pendingAction);
  if (pendingAction) lastActionRef.current = pendingAction;

  const copy = getConfirmCopy(pendingAction ?? lastActionRef.current);

  return (
    <ConfirmDialog
      {...copy}
      isOpen={pendingAction !== null}
      isConfirming={isConfirming}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
