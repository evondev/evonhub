import { cn } from "@/shared/utils";
import Image from "next/image";

export interface CommentAvatarProps {
  name?: string;
  avatar?: string;
  className?: string;
}

// Avatar 32px của bình luận. Không có ảnh thì hiện hai chữ cái cuối của tên.
export function CommentAvatar({ name = "", avatar, className }: CommentAvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt=""
        width={32}
        height={32}
        // Ảnh đại diện đến từ nhiều host (Clerk, Google…), không qua bộ tối ưu
        unoptimized
        className={cn("size-8 shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full bg-foreground/5 text-xs font-medium text-muted",
        className,
      )}
    >
      {initials}
    </span>
  );
}
