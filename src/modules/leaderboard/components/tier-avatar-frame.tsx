import { cn } from "@/shared/utils";
import { ReactNode } from "react";
import { TIER_FRAME_CLASS_NAMES } from "../constants";
import { TierBadge } from "./tier-badge";

interface TierAvatarFrameProps {
  level: number;
  children: ReactNode;
  className?: string;
  /** Cỡ và vị trí huy hiệu gắn ở mép dưới; avatar to thì huy hiệu to theo */
  badgeClassName?: string;
}

/**
 * Viền màu theo bậc bao quanh avatar, huy hiệu bậc gắn giữa mép dưới như khung
 * avatar trong game. Chưa có bậc thì để avatar trơn
 */
export function TierAvatarFrame({
  level,
  children,
  className,
  badgeClassName,
}: TierAvatarFrameProps) {
  const frameClassName = TIER_FRAME_CLASS_NAMES[level];

  if (!frameClassName) return <>{children}</>;

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full p-[3px]",
        className,
      )}
    >
      {/* Lớp màu nằm riêng để bậc cao xoay được mà avatar đứng yên */}
      <span
        aria-hidden
        className={cn("absolute inset-0 rounded-full", frameClassName)}
      />
      <span className="relative grid rounded-full bg-surface p-0.5">
        {children}
      </span>
      <TierBadge
        level={level}
        className={cn(
          "absolute -bottom-2.5 left-1/2 size-6 -translate-x-1/2",
          badgeClassName,
        )}
      />
    </span>
  );
}
