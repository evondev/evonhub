"use client";
import { useUserContext } from "@/components/user-context";
import { adminRoutes, menuLinks } from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuLink } from "./menu-link";

export interface SidebarProps {
  role?: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const { userInfo } = useUserContext();
  const pathname = usePathname();
  const isActiveLink = (url: string) => pathname === url;
  const { isLessonPage } = useLessonDetailsPath();

  if (isLessonPage) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-surface lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            width={32}
            height={32}
            src="/logo-main.png"
            alt=""
            className="size-8 object-contain"
          />
          <span className="text-base font-bold text-foreground">EvonHub</span>
        </Link>
      </div>
      <ul className="flex flex-col gap-1 overflow-y-auto px-3 py-3">
        {menuLinks.map((link) => {
          if (adminRoutes.includes(link.url) && UserRole.Admin !== role)
            return null;
          if (
            (link.isAdmin || link.isExpert) &&
            ![UserRole.Admin, UserRole.Expert].includes(role as UserRole)
          )
            return null;
          if (link.isAuth && !userInfo?._id) return null;
          if (
            link.isHideForAdmin &&
            [UserRole.Admin].includes(role as UserRole)
          )
            return null;

          return (
            <li key={link.title}>
              <MenuLink
                isExternal={link.isExternal}
                link={link}
                isActiveLink={isActiveLink}
                isNew={link.isNew}
                isHot={link.isHot}
                isFree={link.isFree}
              ></MenuLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
