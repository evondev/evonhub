import { HeroAurora } from "./hero-aurora";

/** Nền hero: lưới kẻ mờ dần ra ngoài và dải Aurora trên đỉnh, chỉ để trang trí */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-strong)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-strong)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black_30%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[36rem] [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
        <HeroAurora />
      </div>
    </div>
  );
}
