"use client";
import { adminNavLinks } from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { MenuLinkItemProps } from "@/shared/types";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavProps {
  role?: UserRole;
}

function isVisibleForRole(link: MenuLinkItemProps, role: UserRole | undefined) {
  if (link.isAdmin) return role === UserRole.Admin;
  if (link.isExpert) {
    return [UserRole.Admin, UserRole.Expert].includes(role as UserRole);
  }

  return true;
}

/** Tab chuyển giữa các trang danh sách trong khu quản lý */
export function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname();
  const visibleLinks = adminNavLinks.filter((link) =>
    isVisibleForRole(link, role),
  );

  // Trang con (thêm, sửa, soạn nội dung) có nút quay lại riêng: thanh tab chỉ
  // hiện ở trang danh sách cho đỡ chật
  if (!visibleLinks.some((link) => link.url === pathname)) return null;

  return (
    <nav
      aria-label="Điều hướng quản lý"
      className="-mx-4 mb-6 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
    >
      <ul className="flex w-max min-w-full items-center gap-1 border-b border-border">
        {visibleLinks.map((link) => {
          const isActive = link.url === pathname;

          return (
            <li key={link.url}>
              <Link
                href={link.url}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "-mb-px flex h-10 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-sm outline-none transition-colors focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-primary/30",
                  isActive && "border-foreground font-medium text-foreground",
                  !isActive &&
                    "border-transparent text-foreground/70 hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-4 items-center justify-center [&>svg]:size-4"
                >
                  {link.icon}
                </span>
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
