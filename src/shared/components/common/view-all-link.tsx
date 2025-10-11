import Link from "next/link";
import { IconLongArrowRight } from "../icons";

export interface ViewAllLinkProps {
  href: string;
}

export function ViewAllLink({ href }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className="font-bold hover:border-primary transition-all hover:text-primary inline-flex items-center gap-2 text-sm size-8 rounded-lg borderDarkMode justify-center bgDarkMode"
    >
      <IconLongArrowRight className="size-5" />
    </Link>
  );
}
