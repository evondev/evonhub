import { HeroLightRays } from "./hero-light-rays";

/** Nền hero tối: lưới mảnh, chấm sao, quầng tím và chùm tia sáng trên đỉnh */
export function NeonBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-20"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_20%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] bg-[size:72px_72px] bg-[position:18px_30px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgb(139_92_246/0.2),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-[44rem] [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
        <HeroLightRays />
      </div>
    </div>
  );
}
