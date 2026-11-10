"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DASHBOARD_PATH,
  menuLinks,
} from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import { ProductLogo } from "@/shared/components/product-logo";
import {
  MenuLinkItemProps,
  MenuLinkSection,
  MenuLinkSignal,
} from "@/shared/types";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLinkList } from "./sidebar-link-list";

export interface SidebarProps {
  role?: UserRole;
  /** Phòng chat có người, có tin chưa đọc: hiện ở mục Trò chuyện */
  chatSignal?: MenuLinkSignal | null;
}

function isVisibleInSidebar(
  link: MenuLinkItemProps,
  role: UserRole | undefined,
) {
  const isManager = [UserRole.Admin, UserRole.Expert].includes(
    role as UserRole,
  );

  if ((link.isAdmin || link.isExpert) && !isManager) return false;
  if (link.isHideForAdmin && role === UserRole.Admin) return false;

  return true;
}

function isManageLink(link: MenuLinkItemProps) {
  return Boolean(link.isAdmin || link.isExpert);
}

function isLinkInSection(link: MenuLinkItemProps, section: MenuLinkSection) {
  return !isManageLink(link) && (link.section || "learn") === section;
}

export function Sidebar({ role, chatSignal }: SidebarProps) {
  const pathname = usePathname();
  const { isLessonPage } = useLessonDetailsPath();
  const { isSidebarCollapsed = false } = useGlobalStore();

  if (isLessonPage) return null;

  const visibleLinks = menuLinks.filter((link) =>
    isVisibleInSidebar(link, role),
  );
  // Nhóm trên cùng theo thứ tự: học, cộng đồng, quản lý; trang ngoài ghim ở đáy
  const linkGroups = [
    visibleLinks.filter((link) => isLinkInSection(link, "learn")),
    visibleLinks.filter((link) => isLinkInSection(link, "community")),
    visibleLinks.filter(isManageLink),
  ].filter((links) => links.length > 0);
  const externalLinks = visibleLinks.filter((link) =>
    isLinkInSection(link, "external"),
  );

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
          href={DASHBOARD_PATH}
          className="flex items-center gap-2.5 whitespace-nowrap outline-none"
        >
          <ProductLogo />
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
          {linkGroups.map((links, index) => (
            <div
              key={links[0].url}
              className={cn(index > 0 && "mt-3 border-t border-border pt-3")}
            >
              <SidebarLinkList
                links={links}
                pathname={pathname}
                isCollapsed={isSidebarCollapsed}
                chatSignal={chatSignal}
              />
            </div>
          ))}

          {externalLinks.length > 0 && (
            <div className="mt-auto border-t border-border pt-3">
              <SidebarLinkList
                links={externalLinks}
                pathname={pathname}
                isCollapsed={isSidebarCollapsed}
              />
            </div>
          )}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
