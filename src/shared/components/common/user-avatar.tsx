import { cn } from "@/shared/utils";
import {
  getAvatarInitial,
  getAvatarToneClassName,
  hasCustomAvatar,
} from "@/shared/utils/avatar.utils";
import { UserRound } from "lucide-react";
import Image from "next/image";

export interface UserAvatarProps {
  name?: string;
  avatar?: string;
  className?: string;
}

// Avatar tròn 32px. Chưa có ảnh (hoặc đang dùng ảnh mặc định của Clerk) thì hiện
// chữ cái đầu của tên trên nền nhạt, viền cùng màu.
export function UserAvatar({ name = "", avatar, className }: UserAvatarProps) {
  if (hasCustomAvatar(avatar)) {
    return (
      <Image
        src={avatar}
        alt=""
        width={48}
        height={48}
        // Ảnh đại diện đến từ nhiều host (Clerk, Google…), không qua bộ tối ưu
        unoptimized
        className={cn(
          "size-8 shrink-0 rounded-full object-cover ring-1 ring-border",
          className,
        )}
      />
    );
  }

  const initial = getAvatarInitial(name);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 select-none place-items-center rounded-full border text-sm font-semibold",
        getAvatarToneClassName(name),
        className,
      )}
    >
      {initial || <UserRound className="size-1/2" />}
    </span>
  );
}
