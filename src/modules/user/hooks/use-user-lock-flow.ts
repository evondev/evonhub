import { UserStatus } from "@/shared/constants/user.constants";
import { useState } from "react";
import { toast } from "react-toastify";
import { USER_STATUS_SAVE_ERROR_MESSAGE } from "../constants/user-manage.constants";
import {
  UpdateUserStatusResult,
  UserManageRow,
} from "../types/user-manage.types";
import { isLockedUser } from "../utils/user-manage.utils";

interface UseUserLockFlowOptions {
  /** Gọi server (trang thật) hoặc giả lập (trang xem trước) */
  changeStatus: (
    user: UserManageRow,
    status: UserStatus,
  ) => Promise<UpdateUserStatusResult>;
}

/**
 * Khoá tài khoản là cắt quyền vào học nên luôn qua hộp xác nhận; mở khoá không
 * mất gì nên làm ngay. Xong thì toast, lỗi thì toast câu lỗi của server.
 */
export function useUserLockFlow({ changeStatus }: UseUserLockFlowOptions) {
  const [userPendingLock, setUserPendingLock] = useState<UserManageRow | null>(
    null,
  );
  const [isLocking, setIsLocking] = useState(false);

  async function submitStatus(
    user: UserManageRow,
    status: UserStatus,
  ): Promise<boolean> {
    try {
      const result = await changeStatus(user, status);

      if (!result.isSuccess) {
        toast.error(result.message || USER_STATUS_SAVE_ERROR_MESSAGE);
        return false;
      }

      const successMessage =
        status === UserStatus.Inactive
          ? `Đã khoá tài khoản ${user.name}`
          : `Đã mở khoá tài khoản ${user.name}`;

      toast.success(successMessage);
      return true;
    } catch {
      toast.error(USER_STATUS_SAVE_ERROR_MESSAGE);
      return false;
    }
  }

  function handleToggleStatus(user: UserManageRow) {
    if (isLockedUser(user)) {
      void submitStatus(user, UserStatus.Active);
      return;
    }

    setUserPendingLock(user);
  }

  async function handleConfirmLock() {
    if (!userPendingLock) return;

    setIsLocking(true);

    const isLocked = await submitStatus(userPendingLock, UserStatus.Inactive);

    setIsLocking(false);

    if (isLocked) setUserPendingLock(null);
  }

  function handleCancelLock() {
    setUserPendingLock(null);
  }

  return {
    userPendingLock,
    isLocking,
    handleToggleStatus,
    handleConfirmLock,
    handleCancelLock,
  };
}
