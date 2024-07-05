"use client";
import { menuLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enums";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = ({ role }: { role: string }) => {
  const pathname = usePathname();
  const isActiveLink = (url: string) => pathname === url;
  return (
    <div className="xl:hidden">
      <ul className="flex justify-center gap-3 fixed bottom-0 left-0 right-0 z-10 p-2 dark:bg-grayDarker bg-white h-14 border-t border-gray-200 dark:border-opacity-10">
        {menuLinks.map((link) => {
          if (link.isHideMobile || (link.isAuth && role === Role.ADMIN))
            return null;
          if (link.isAdmin && ![Role.ADMIN].includes(role as Role)) return null;
          if (
            link.isExpert &&
            ![Role.EXPERT, Role.ADMIN].includes(role as Role)
          )
            return null;
          return (
            <li key={link.title}>
              <Link
                href={link.url}
                className={cn(
                  "size-10 flex items-center justify-center rounded p-1.5 transition-all",
                  isActiveLink(link.url) ? "bg-primary text-white" : ""
                )}
              >
                {link.icon}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navigation;
