import { cn } from "@/shared/utils";

interface LandingSectionHeadingProps {
  /** Nhãn mono nhỏ có chấm sáng phía trên tiêu đề */
  eyebrow: string;
  title: string;
  /** Vế sau của tiêu đề, xuống dòng và tô màu nhạt */
  mutedTitle: string;
  description?: string;
  isCentered?: boolean;
}

/** Tiêu đề section hai tông: vế đầu trắng mờ dần xuống, vế sau nhạt */
export function LandingSectionHeading({
  eyebrow,
  title,
  mutedTitle,
  description,
  isCentered = false,
}: LandingSectionHeadingProps) {
  return (
    <div
      className={cn(
        "reveal-on-scroll flex max-w-2xl flex-col items-start gap-5",
        isCentered && "mx-auto items-center text-center",
      )}
    >
      <p className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.18em] text-violet-200 ring-1 ring-inset ring-violet-400/25">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_2px_rgb(167_139_250/0.8)]"
        />
        {eyebrow}
      </p>
      <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
          {title}
        </span>{" "}
        <span className="block text-muted">{mutedTitle}</span>
      </h2>
      {description && (
        <p className="text-pretty text-base leading-7 text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
