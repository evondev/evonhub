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
      <ul className="flex justify-center gap-5 fixed bottom-0 left-0 right-0 z-10 p-2 dark:bg-grayDarker bg-white">
        {menuLinks.map((link) => {
          if (
            (link.url.includes("coaching") || link.url.includes("hub")) &&
            role === Role.ADMIN
          )
            return null;
          if (link.isAdmin && role !== Role.ADMIN) return null;
          return (
            <li key={link.title}>
              <Link
                href={link.url}
                className={cn(
                  "size-10 flex items-center justify-center rounded-lg transition-all",
                  isActiveLink(link.url) ? "gradientPrimary text-white" : ""
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
