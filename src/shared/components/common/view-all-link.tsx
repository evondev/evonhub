import Link from "next/link";
import { IconLongArrowRight } from "../icons";

export interface ViewAllLinkProps {
  href: string;
}

export function ViewAllLink({ href }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className="font-bold hover:text-primary inline-flex items-center gap-2 text-sm"
    >
      <span>Xem tất cả</span>
      <IconLongArrowRight />
    </Link>
  );
}
