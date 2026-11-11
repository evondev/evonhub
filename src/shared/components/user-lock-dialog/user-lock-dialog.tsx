"use client";

import { ConfirmDialog } from "@/shared/components/common";
import { DEFAULT_USER_LOCK_INPUT } from "@/shared/constants/user.constants";
import { UserLockInput, UserLockTarget } from "@/shared/types/user.types";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { UserLockFields } from "./user-lock-fields";

interface UserLockDialogProps {
  /** Người đang chờ xác nhận khoá; null là hộp đóng */
  user: UserLockTarget | null;
  isLocking: boolean;
  onConfirm: (lock: UserLockInput) => void;
  onCancel: () => void;
}

/** Hộp xác nhận khoá tài khoản kèm thời hạn và lý do */
export function UserLockDialog({
  user,
  isLocking,
  onConfirm,
  onCancel,
}: UserLockDialogProps) {
  // Giữ người vừa xem trong lúc hộp chạy hiệu ứng đóng, kẻo chữ chớp mất
  const [shownUser, setShownUser] = useState(user);
  const [lockInput, setLockInput] = useState<UserLockInput>(
    DEFAULT_USER_LOCK_INPUT,
  );

  // Mỗi lần mở cho người mới thì về lại mức mặc định
  useEffect(() => {
    if (!user) return;

    setShownUser(user);
    setLockInput(DEFAULT_USER_LOCK_INPUT);
  }, [user]);

  // Khoảng trắng không rộng trước "@": email dài xuống dòng trước tên miền, không gãy giữa tên miền
  const wrappableEmail = (shownUser?.email || "").replace("@", "​@");

  return (
    <ConfirmDialog
      isOpen={Boolean(user)}
      icon={Lock}
      title="Khoá tài khoản này?"
      description={
        <>
          <span className="font-medium text-foreground">{shownUser?.name}</span>
          {wrappableEmail && <> ({wrappableEmail})</>} sẽ không vào được web, kể
          cả các khoá đã mua, cho tới khi hết hạn. Mở khoá sớm được bất cứ lúc
          nào.
        </>
      }
      confirmLabel="Khoá tài khoản"
      isConfirming={isLocking}
      onConfirm={() => onConfirm(lockInput)}
      onCancel={onCancel}
    >
      <UserLockFields
        value={lockInput}
        isDisabled={isLocking}
        onChange={setLockInput}
      />
    </ConfirmDialog>
  );
}
