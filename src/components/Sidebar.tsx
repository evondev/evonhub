"use client";
import { adminRoutes, menuLinks } from "@/constants";
import { useGlobalStore } from "@/store";
import { Role } from "@/types/enums";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuLink from "./MenuLink";
import ButtonGradient from "./button/ButtonGradient";

const Sidebar = ({ role }: { role: string }) => {
  const { currentUser } = useGlobalStore();
  const pathname = usePathname();
  const isActiveLink = (url: string) => pathname === url;
  return (
    <aside className="bg-white fixed top-0 left-0 pb-8 px-5 hidden xl:block dark:bg-grayDark bottom-0 w-[300px] z-50 sidebar">
      <Link href="/" className="flex items-center gap-2 py-3 mb-5 h-20">
        <ButtonGradient
          className={{
            wrapper: "rounded-full size-12 flex-shrink-0",
            main: "p-3",
          }}
        >
          <Image
            width={40}
            height={40}
            src="/logo.png"
            alt="EvonHub"
            className="max-h-full max-w-full brightness-0 object-contain dark:brightness-100"
          ></Image>
        </ButtonGradient>
        <span className="text-xl font-bold">evonHub</span>
      </Link>
      <ul className="flex flex-col gap-3">
        {menuLinks.map((link) => {
          if (adminRoutes.includes(link.url) && Role.ADMIN !== role)
            return null;
          if (link.isAdmin && ![Role.ADMIN, Role.EXPERT].includes(role as Role))
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
