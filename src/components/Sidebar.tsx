"use client";
import { menuLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuLink from "./MenuLink";

const Sidebar = ({ role }: { role: string }) => {
  const pathname = usePathname();
  const isActiveLink = (url: string) => pathname === url;
  return (
    <aside className="bg-white sticky top-0 left-0 py-8 px-5 hidden xl:block dark:bg-grayDark h-screen">
      <Link href="/" className="flex items-center gap-2 py-3 mb-5">
        <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-grayDarker p-3.5">
          <Image
            width={40}
            height={40}
            src="/logo.png"
            alt="EvonHub"
            className="object-contain max-w-full"
          ></Image>
        </span>
        <span className="text-xl font-bold">EvonHub</span>
      </Link>
      <ul className="flex flex-col gap-3">
        {menuLinks.map((link) => {
          if (link.isAdmin && role !== "ADMIN") return null;
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
