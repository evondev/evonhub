"use client";

import { Button } from "@/components/ui/button";
import { ProductLogo } from "@/shared/components/product-logo";
import { UserLock } from "@/shared/types/user.types";
import { formatUserLockUntil } from "@/shared/utils/user-lock.utils";
import { useClerk } from "@clerk/nextjs";
import { Lock } from "lucide-react";
import Link from "next/link";

interface AccountLockedStateProps {
  /** Không có khi bị khoá theo kiểu cũ hoặc do tài khoản Clerk bị xoá: coi như vĩnh viễn */
  lock?: UserLock;
}

/**
 * Thay cả khung app khi tài khoản bị khoá: nói rõ tới bao giờ và vì sao, để
 * người dùng không tưởng web hỏng
 */
export function AccountLockedState({ lock }: AccountLockedStateProps) {
  const { signOut } = useClerk();
  const unlockAtLabel = formatUserLockUntil(lock?.until);
  const reason = lock?.reason?.trim();

  function handleSignOut() {
    void signOut({ redirectUrl: "/" });
  }

  return (
    <section className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <Link href="/" aria-label="EvonHub, về trang chủ" className="mb-8 flex">
        <ProductLogo className="size-10" />
      </Link>
      <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10">
        <Lock className="size-5 text-rose-700 dark:text-rose-400" aria-hidden />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-foreground">
        {unlockAtLabel ? "Tài khoản đang bị tạm khoá" : "Tài khoản đã bị khoá"}
      </h1>
      <p className="mt-2 text-pretty text-sm text-muted">
        {unlockAtLabel
          ? `Bạn dùng lại được từ ${unlockAtLabel}. Các khoá học đã mua vẫn còn nguyên.`
          : "Liên hệ admin nếu bạn nghĩ đây là nhầm lẫn."}
      </p>
      {reason && (
        <div className="mt-6 w-full rounded-xl border border-border bg-surface p-4 text-left">
          <p className="text-xs font-medium text-muted">Lý do</p>
          <p className="mt-1 whitespace-pre-line break-words text-sm text-foreground">
            {reason}
          </p>
        </div>
      )}
      <Button
        variant="outline"
        className="mt-8 h-11 w-full sm:w-auto md:h-10"
        onClick={handleSignOut}
      >
        Đăng xuất
      </Button>
    </section>
  );
}
