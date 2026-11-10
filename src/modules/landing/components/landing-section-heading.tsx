import { cn } from "@/shared/utils";

interface LandingSectionHeadingProps {
  /** Nhãn nhỏ màu nhấn phía trên tiêu đề */
  eyebrow: string;
  title: string;
  /** Vế sau của tiêu đề, xuống dòng và tô màu nhạt */
  mutedTitle: string;
  description?: string;
  isCentered?: boolean;
}

/** Tiêu đề section hai tông: vế đầu đậm, vế sau nhạt */
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
        "reveal-on-scroll flex max-w-2xl flex-col gap-4",
        isCentered && "mx-auto items-center text-center",
      )}
    >
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title} <span className="block text-muted">{mutedTitle}</span>
      </h2>
      {description && (
        <p className="text-pretty text-base leading-7 text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
