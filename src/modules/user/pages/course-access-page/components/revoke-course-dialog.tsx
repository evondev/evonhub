"use client";

import { ConfirmDialog } from "@/shared/components/common";
import { BookX } from "lucide-react";
import { useRef } from "react";
import { CourseAccessGrant } from "../../../types/course-access.types";

interface RevokeCourseDialogProps {
  pendingGrant: CourseAccessGrant | null;
  userName: string;
  isRevoking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Thu hồi là cắt quyền học: hộp đỏ như hộp xoá, tên khóa và tên người nổi lên */
export function RevokeCourseDialog({
  pendingGrant,
  userName,
  isRevoking,
  onConfirm,
  onCancel,
}: RevokeCourseDialogProps) {
  // Lúc đóng, pendingGrant về null ngay mà hộp còn chạy chuyển động 100ms:
  // giữ khóa cuối cùng để chữ trong hộp không nhảy
  const lastGrantRef = useRef(pendingGrant);
  if (pendingGrant) lastGrantRef.current = pendingGrant;

  const courseTitle = lastGrantRef.current?.course.title || "";

  return (
    <ConfirmDialog
      isOpen={pendingGrant !== null}
      icon={BookX}
      title="Thu hồi khóa học?"
      confirmLabel="Thu hồi khóa học"
      isConfirming={isRevoking}
      onConfirm={onConfirm}
      onCancel={onCancel}
      description={
        <p>
          <span className="font-medium text-foreground">{userName}</span> sẽ
          không vào học{" "}
          <span className="font-medium text-foreground">{courseTitle}</span>{" "}
          được nữa. Đơn hàng của khóa này chuyển sang Bị từ chối.
        </p>
      }
    />
  );
}
