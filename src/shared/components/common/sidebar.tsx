"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserContext } from "@/components/user-context";
import { adminRoutes, menuLinks } from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import { MenuLinkItemProps } from "@/shared/types";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuLink } from "./menu-link";

export interface SidebarProps {
  role?: UserRole;
}

function isVisibleInSidebar(
  link: MenuLinkItemProps,
  role: UserRole | undefined,
  isSignedIn: boolean,
) {
  const isManager = [UserRole.Admin, UserRole.Expert].includes(
    role as UserRole,
  );

  if (adminRoutes.includes(link.url) && role !== UserRole.Admin) return false;
  if ((link.isAdmin || link.isExpert) && !isManager) return false;
  if (link.isAuth && !isSignedIn) return false;
  if (link.isHideForAdmin && role === UserRole.Admin) return false;

  return true;
}

function isManageLink(link: MenuLinkItemProps) {
  return Boolean(link.isAdmin || link.isExpert);
}

export function Sidebar({ role }: SidebarProps) {
  const { userInfo } = useUserContext();
  const pathname = usePathname();
  const { isLessonPage } = useLessonDetailsPath();
  const { isSidebarCollapsed = false } = useGlobalStore();

  if (isLessonPage) return null;

  const visibleLinks = menuLinks.filter((link) =>
    isVisibleInSidebar(link, role, Boolean(userInfo?._id)),
  );
  const mainLinks = visibleLinks.filter((link) => !isManageLink(link));
  const manageLinks = visibleLinks.filter(isManageLink);

  return (
    <aside
      className={cn(
        "fixed inset-y-4 left-4 z-50 hidden flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[width] duration-200 ease-out motion-reduce:transition-none lg:flex",
        isSidebarCollapsed && "w-16",
        !isSidebarCollapsed && "w-64",
      )}
    >
      {/* Cùng top-4 và h-16 với thanh header: logo và nút thu gọn nằm cùng một hàng.
          Lúc thu, ruột sidebar còn 62px (w-16 trừ viền 2px): logo 32px cách
          mép 15px là đúng tâm, cùng tâm với icon menu bên dưới. */}
      <div className="flex h-16 shrink-0 items-center px-[15px]">
        <Link
          href="/"
          className="flex items-center gap-2.5 whitespace-nowrap outline-none"
        >
          <Image
            width={32}
            height={32}
            src="/logo-main.png"
            alt=""
            className="size-8 shrink-0 object-contain"
          />
          <span
            className={cn(
              "text-base font-semibold text-foreground transition-opacity duration-150 motion-reduce:transition-none",
              isSidebarCollapsed && "opacity-0",
            )}
          >
            EvonHub
          </span>
        </Link>
      </div>

      <TooltipProvider delayDuration={0}>
        <nav
          aria-label="Điều hướng chính"
          className={cn(
            "flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-[11px] py-3",
            isSidebarCollapsed && "[scrollbar-width:none]",
          )}
        >
          <ul className="flex flex-col gap-1.5">
            {mainLinks.map((link) => (
              <li key={link.url}>
                <MenuLink
                  link={link}
                  isActive={pathname === link.url}
                  isCollapsed={isSidebarCollapsed}
                />
              </li>
            ))}
          </ul>

          {manageLinks.length > 0 && (
            <div className="mt-4">
              {/* Nhãn mờ đi tại chỗ, giữ chiều cao hàng để icon bên dưới
                  không nhảy; lúc thu thì gạch ngắn thẳng tâm icon thay chữ. */}
              <div className="relative flex h-10 items-center px-[11px]">
                <span
                  className={cn(
                    "whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted transition-opacity duration-150 motion-reduce:transition-none",
                    isSidebarCollapsed && "opacity-0",
                  )}
                >
                  Quản lý
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-3 h-px w-4 bg-border-strong transition-opacity duration-150 motion-reduce:transition-none",
                    !isSidebarCollapsed && "opacity-0",
                  )}
                />
              </div>
              <ul className="flex flex-col gap-1.5">
                {manageLinks.map((link) => (
                  <li key={link.url}>
                    <MenuLink
                      link={link}
                      isActive={pathname === link.url}
                      isCollapsed={isSidebarCollapsed}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
