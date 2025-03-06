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
        "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all font-medium",
        isActiveLink(link.url)
          ? "bg-primary bg-opacity-10 text-primary font-semibold svg-animate"
          : "text-gray70 dark:text-slate-500 hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:hover:text-primary"
      )}
    >
      <div className="size-5 flex items-center justify-center">{link.icon}</div>
      <span>{link.title}</span>
      {isNew && (
        <span className="ml-auto inline-flex text-white px-2 py-0.5 font-bold text-xs rounded-full bg-green-500 w-11 justify-center">
          New
        </span>
      )}
      {isHot && (
        <span className="ml-auto inline-flex text-white px-2 py-0.5 font-bold text-xs rounded-full bg-red-500 w-11 justify-center">
          Hot
        </span>
      )}
    </Link>
  );
}
