import { MenuLinkItemProps } from "@/shared/types";
import { cn } from "@/shared/utils";
import Link from "next/link";

interface MenuLinkProps {
  link: MenuLinkItemProps;
  isActiveLink: (url: string) => boolean;
  isExternal?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isFree?: boolean;
}

export function MenuLink({
  link,
  isActiveLink,
  isExternal,
  isNew = false,
  isHot = false,
  isFree = false,
}: MenuLinkProps) {
  const isActive = isActiveLink(link.url);

  return (
    <Link
      target={isExternal ? "_blank" : "_self"}
      href={link.url}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm outline-none transition-colors",
        isActive && "font-semibold text-primary",
        !isActive &&
          "text-foreground/70 hover:bg-item-hover hover:text-foreground",
      )}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-2.5 h-5 w-[3px] rounded-full bg-primary"
        />
      )}
      <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
        {link.icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{link.title}</span>
      {(isNew || isFree) && (
        <span className="ml-auto inline-flex shrink-0 rounded-full border border-green-500 px-2 py-0.5 text-xs font-bold text-green-500">
          {isNew ? "New" : "Free"}
        </span>
      )}
      {isHot && (
        <span className="ml-auto inline-flex shrink-0 rounded-full border border-red-500 px-2 py-0.5 text-xs font-bold text-red-500">
          Hot
        </span>
      )}
    </Link>
  );
}
