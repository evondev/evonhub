import Link from "next/link";

export interface ViewAllLinkProps {
  href: string;
  text?: string;
}

export function ViewAllLink({ href, text }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className="font-bold hover:border-primary transition-all hover:text-primary inline-flex items-center gap-2 text-sm rounded-xl justify-center underline"
    >
      <span>{text}</span>
    </Link>
  );
}
