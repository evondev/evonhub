import { ConfirmDialog } from "@/shared/components/common";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { UserManageRow } from "../../../types/user-manage.types";

interface UserLockDialogProps {
  /** Thành viên đang chờ xác nhận khoá; null là hộp đóng */
  user: UserManageRow | null;
  isLocking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UserLockDialog({
  user,
  isLocking,
  onConfirm,
  onCancel,
}: UserLockDialogProps) {
  // Giữ người vừa xem trong lúc hộp chạy hiệu ứng đóng, kẻo chữ chớp mất
  const [shownUser, setShownUser] = useState(user);

  useEffect(() => {
    if (user) setShownUser(user);
  }, [user]);

  // Khoảng trắng không rộng trước "@": email dài xuống dòng trước tên miền, không gãy giữa tên miền
  const wrappableEmail = (shownUser?.email || "").replace("@", "\u200B@");

  return (
    <ConfirmDialog
      isOpen={Boolean(user)}
      icon={Lock}
      title="Khoá tài khoản này?"
      description={
        <>
          <span className="font-medium text-foreground">{shownUser?.name}</span>{" "}
          ({wrappableEmail}) sẽ không vào học được nữa, kể cả các khoá đã mua.
          Mở khoá lại được bất cứ lúc nào.
        </>
      }
      confirmLabel="Khoá tài khoản"
      isConfirming={isLocking}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
