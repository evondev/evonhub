import { cn } from "@/shared/utils";
import Image from "next/image";
import { getFirstName } from "../utils";

interface TestimonialAvatarProps {
  name: string;
  avatar?: string;
  /** Cỡ ảnh tính bằng px: 32 cho thẻ nhỏ, 40 cho cảm nhận lớn */
  size: 32 | 40;
}

export function TestimonialAvatar({
  name,
  avatar,
  size,
}: TestimonialAvatarProps) {
  const sizeClassName = cn(size === 32 && "size-8", size === 40 && "size-10");

  if (avatar) {
    return (
      <Image
        width={size}
        height={size}
        alt=""
        src={avatar}
        className={cn("shrink-0 rounded-full object-cover", sizeClassName)}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold uppercase text-primary-strong",
        sizeClassName,
      )}
    >
      {getFirstName(name).charAt(0)}
    </span>
  );
}
