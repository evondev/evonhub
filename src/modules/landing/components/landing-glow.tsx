import { cn } from "@/shared/utils";

interface LandingGlowProps {
  /** Vị trí, kích thước của quầng sáng */
  className: string;
}

/** Quầng sáng màu nhấn mờ dần ra ngoài, chỉ để trang trí */
export function LandingGlow({ className }: LandingGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 bg-[radial-gradient(closest-side,rgb(var(--primary)/0.22),transparent)]",
        className,
      )}
    />
  );
}
