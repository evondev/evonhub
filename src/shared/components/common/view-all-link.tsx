import { cn } from "@/shared/utils";
import Link from "next/link";

export interface ViewAllLinkProps {
  href: string;
  text?: string;
  className?: string;
}

export function ViewAllLink({ href, text, className }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 shrink-0 items-center text-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline",
        className,
      )}
    >
      {text}
    </Link>
  );
}
