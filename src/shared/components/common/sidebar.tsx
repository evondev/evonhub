"use client";
import { useUserContext } from "@/components/user-context";
import { adminRoutes, menuLinks } from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLongArrowRight, IconStarFilled } from "../icons";
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
    <aside className="fixed top-0 left-0 pb-5 px-5 hidden xl:flex flex-col bgDarkMode bottom-0 w-[300px] z-50 sidebar border-r border-gray-200 dark:border-opacity-10">
      <Link href="/" className="flex items-center gap-2 py-3 mb-5">
        <div className="bg-primary p-3 rounded-full size-10 flex-shrink-0">
          <Image
            width={48}
            height={48}
            src="/logo.png"
            alt="EvonHub"
            className="max-h-full max-w-full object-contain"
          ></Image>
        </div>
        <span className="text-xl font-bold">evonHub</span>
      </Link>
      <ul className="flex flex-col gap-3">
        {menuLinks.map((link) => {
          if (adminRoutes.includes(link.url) && UserRole.Admin !== role)
            return null;
          if (
            (link.isAdmin || link.isExpert) &&
            ![UserRole.Admin, UserRole.Expert].includes(role as UserRole)
          )
            return null;
          if (link.isAuth && !userInfo?._id) return null;
          return (
            <li key={link.title}>
              <MenuLink
                isExternal={link.isExternal}
                link={link}
                isActiveLink={isActiveLink}
                isNew={link.isNew}
                isHot={link.isHot}
              ></MenuLink>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto p-2 rounded-lg bg-secondary/10 relative">
        <div className="size-8 p-2 flex items-center justify-center rounded-full bg-primary/20 text-primary absolute right-2 top-2">
          <IconStarFilled />
        </div>
        <h3 className="font-bold text-base lg:text-lg">Membership!</h3>
        <div className="text-sm">
          Sở hữu toàn bộ khóa học 1 cách nhanh nhất.
        </div>
        <Link
          href="/membership"
          className="mt-2 flex items-center justify-between gap-2 p-2 text-sm rounded-lg bg-primary text-white font-bold"
        >
          <span>Khám phá ngay</span>
          <IconLongArrowRight />
        </Link>
      </div>
    </aside>
  );
}
