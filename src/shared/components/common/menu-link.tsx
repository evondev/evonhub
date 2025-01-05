import { MenuLinkItemProps } from "@/shared/types";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface MenuLinkProps {
  link: MenuLinkItemProps;
  isActiveLink: (url: string) => boolean;
}

export function MenuLink({ link, isActiveLink }: MenuLinkProps) {
  return (
    <Link
      href={link.url}
      className={twMerge(
        "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all font-medium",
        isActiveLink(link.url)
          ? "bg-primary bg-opacity-10 text-primary font-medium svg-animate"
          : "text-gray70 dark:text-slate-500 hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:hover:text-primary"
      )}
    >
      <div className="size-5 flex items-center justify-center">{link.icon}</div>
      <span>{link.title}</span>
    </Link>
  );
}
