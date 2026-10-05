"use client";
import { cn } from "@/lib/utils";
import {
  COURSE_DETAILS_PATH_PREFIX,
  menuLinks,
} from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { MenuLinkItemProps } from "@/shared/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavigationProps {
  role: string;
}

function isVisibleOnMobile(link: MenuLinkItemProps, role: string) {
  if (link.isHideMobile || (link.isAuth && role === UserRole.Admin))
    return false;
  if (link.isAdmin && ![UserRole.Admin].includes(role as UserRole))
    return false;
  if (
    link.isExpert &&
    ![UserRole.Expert, UserRole.Admin].includes(role as UserRole)
  )
    return false;
  if (link.isHideForAdmin && [UserRole.Admin].includes(role as UserRole))
    return false;

  return true;
}

export function MobileNavigation({ role }: MobileNavigationProps) {
  const pathname = usePathname();
  const visibleLinks = menuLinks.filter((link) =>
    isVisibleOnMobile(link, role),
  );

  // Trang chi tiết khóa có thanh giá + nút mua dính đáy màn; để cả hai thì hai
  // thanh chồng nhau ăn ~130px. Quay ra bằng đường dẫn hoặc logo trên header.
  if (pathname.startsWith(COURSE_DETAILS_PATH_PREFIX)) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 grid h-16 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      style={{
        gridTemplateColumns: `repeat(${visibleLinks.length}, minmax(0, 1fr))`,
      }}
    >
      {visibleLinks.map((link) => {
        const isActive = pathname === link.url;

        return (
          <Link
            key={link.title}
            target={link.isExternal ? "_blank" : "_self"}
            href={link.url}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-col items-center justify-center gap-1 outline-none",
              isActive && "text-primary",
              !isActive && "text-muted",
            )}
          >
            <span className="flex size-5 items-center justify-center [&>svg]:size-5">
              {link.icon}
            </span>
            <span
              className={cn(
                "max-w-full truncate px-1 text-xs font-medium",
                isActive && "font-semibold",
              )}
            >
              {link.mobileTitle || link.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
