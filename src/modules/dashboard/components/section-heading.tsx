import { ViewAllLink } from "@/shared/components/common";

interface SectionHeadingProps {
  title: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeading({
  title,
  linkText,
  linkHref,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {linkText && linkHref && <ViewAllLink href={linkHref} text={linkText} />}
    </div>
  );
}
