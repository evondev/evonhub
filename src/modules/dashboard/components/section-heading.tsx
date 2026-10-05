import { ViewAllLink } from "@/shared/components/common";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeading({
  title,
  subtitle,
  linkText,
  linkHref,
}: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-pretty text-sm text-muted">{subtitle}</p>
        )}
      </div>
      {linkText && linkHref && <ViewAllLink href={linkHref} text={linkText} />}
    </div>
  );
}
