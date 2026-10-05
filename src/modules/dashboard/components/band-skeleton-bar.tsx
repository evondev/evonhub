import { cn } from "@/shared/utils";

interface BandSkeletonBarProps {
  className?: string;
}

/** Vệt chờ trên nền màu thương hiệu: lớp trắng mờ, vệt xám thường chìm mất */
export function BandSkeletonBar({ className }: BandSkeletonBarProps) {
  return (
    <div
      className={cn(
        "h-3 animate-pulse rounded-full bg-white/20 motion-reduce:animate-none",
        className,
      )}
    />
  );
}
