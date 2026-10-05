import { cn } from "@/shared/utils";
import Image from "next/image";
import { getProfileAvatarTone, getProfileInitial } from "../../../utils";

export interface ProfileAvatarProps {
  name: string;
  /** Username hoặc email: cùng người thì cùng màu ở mọi chỗ */
  seed: string;
  src?: string;
  className?: string;
}

export function ProfileAvatar({
  name,
  seed,
  src,
  className,
}: ProfileAvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={128}
        height={128}
        className={cn(
          "size-16 shrink-0 rounded-full object-cover ring-1 ring-border-strong",
          className,
        )}
      />
    );
  }

  const tone = getProfileAvatarTone(seed);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold",
        tone.background,
        tone.text,
        className,
      )}
    >
      {getProfileInitial(name)}
    </span>
  );
}
