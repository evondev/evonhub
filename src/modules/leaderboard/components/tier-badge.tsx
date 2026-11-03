import { cn } from "@/shared/utils";
import Image from "next/image";
import { getStudyTierByLevel } from "../utils";

interface TierBadgeProps {
  level: number;
  className?: string;
  /** Bậc chưa tới: xám và mờ */
  isLocked?: boolean;
}

/** Huy hiệu bậc học. Chưa có bậc (level 0) thì không hiện gì */
export function TierBadge({
  level,
  className,
  isLocked = false,
}: TierBadgeProps) {
  const tier = getStudyTierByLevel(level);

  if (!tier) return null;

  return (
    <Image
      src={tier.imageSrc}
      alt={`Bậc ${tier.name}`}
      title={`Bậc ${tier.level} · ${tier.name}`}
      width={96}
      height={96}
      className={cn(
        "size-9 shrink-0",
        isLocked && "opacity-50 grayscale",
        className,
      )}
    />
  );
}
