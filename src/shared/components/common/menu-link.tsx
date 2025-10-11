import { MenuLinkItemProps } from "@/shared/types";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface MenuLinkProps {
  link: MenuLinkItemProps;
  isActiveLink: (url: string) => boolean;
  isExternal?: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

export function MenuLink({
  link,
  isActiveLink,
  isExternal,
  isNew = false,
  isHot = false,
}: MenuLinkProps) {
  return (
    <Link
      target={isExternal ? "_blank" : "_self"}
      href={link.url}
      className={twMerge(
        "flex items-center gap-3 py-2.5 pr-3 pl-6 transition-all font-medium border-l-2 border-l-transparent",
        isActiveLink(link.url)
          ? " text-primary font-semibold svg-animate border-l-primary"
          : "text-gray70 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
      )}
    >
      <div className="size-5 flex items-center justify-center">{link.icon}</div>
      <span>{link.title}</span>
      {isNew && (
        <span className="ml-auto inline-flex text-green-500 px-2 py-0.5 font-bold text-xs rounded-full border border-green-500 w-11 justify-center">
          New
        </span>
      )}
      {isHot && (
        <span className="ml-auto inline-flex text-red-500 px-2 py-0.5 font-bold text-xs rounded-full border border-red-500 w-11 justify-center">
          Hot
        </span>
      )}
    </Link>
  );
}
