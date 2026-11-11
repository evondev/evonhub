import { Button } from "@/components/ui/button";
import { ToneBadge } from "@/shared/components/common/tone-badge";
import { UserAvatar } from "@/shared/components/common/user-avatar";
import { ArrowLeft, Lock, LockOpen } from "lucide-react";
import { SupportUserSummary } from "../../../types";
import { getSupportUserLockLabel } from "../../../utils";

interface SupportConversationHeaderProps {
  user: SupportUserSummary;
  isUnlocking: boolean;
  onBack: () => void;
  onLock: () => void;
  onUnlock: () => void;
}

/** Đầu khung chat phía Admin: ai đang nhắn, trạng thái khoá, nút khoá/mở khoá */
export function SupportConversationHeader({
  user,
  isUnlocking,
  onBack,
  onLock,
  onUnlock,
}: SupportConversationHeaderProps) {
  const lockLabel = getSupportUserLockLabel(user);
  // Tài khoản đã bị xoá khỏi DB thì không còn gì để khoá
  const canChangeLock = Boolean(user.id);

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-3 sm:px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Về hộp thư"
        onClick={onBack}
        className="-ml-1 shrink-0 lg:hidden"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <UserAvatar name={user.name} avatar={user.avatar} className="size-10" />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.name}
          </p>
          {lockLabel && (
            <ToneBadge
              tone="error"
              label={lockLabel}
              className="shrink-0 py-0.5"
            />
          )}
        </div>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
      {canChangeLock && user.isLocked && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isUnlocking}
          onClick={onUnlock}
          className="shrink-0"
        >
          <LockOpen className="size-4" aria-hidden />
          Mở khoá
        </Button>
      )}
      {canChangeLock && !user.isLocked && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onLock}
          className="shrink-0"
        >
          <Lock className="size-4" aria-hidden />
          Khoá
        </Button>
      )}
    </header>
  );
}
