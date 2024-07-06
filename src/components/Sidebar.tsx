"use client";
import { adminRoutes, menuLinks } from "@/constants";
import { useGlobalStore } from "@/store";
import { Role } from "@/types/enums";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuLink from "./MenuLink";

const Sidebar = ({ role }: { role: string }) => {
  const { currentUser } = useGlobalStore();
  const pathname = usePathname();
  const isActiveLink = (url: string) => pathname === url;
  return (
    <aside className="fixed top-0 left-0 pb-8 px-5 hidden xl:block bgDarkMode bottom-0 w-[300px] z-50 sidebar border-r border-gray-200 dark:border-opacity-10">
      <Link href="/" className="flex items-center gap-2 py-3 mb-5 h-20">
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
          if (adminRoutes.includes(link.url) && Role.ADMIN !== role)
            return null;
          if (
            (link.isAdmin || link.isExpert) &&
            ![Role.ADMIN, Role.EXPERT].includes(role as Role)
          )
            return null;
          if (link.isAuth && !currentUser?._id) return null;
          return (
            <li key={link.title}>
              <MenuLink link={link} isActiveLink={isActiveLink}></MenuLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
