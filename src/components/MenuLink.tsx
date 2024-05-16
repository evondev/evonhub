import { TMenuLink } from "@/types";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
interface MenuLinkProps {
  link: TMenuLink;
  isActiveLink: (url: string) => boolean;
}
const MenuLink = ({ link, isActiveLink }: MenuLinkProps) => {
  return (
    <Link
      prefetch={false}
      href={link.url}
      className={twMerge(
        "flex items-center gap-4 p-3 rounded-lg transition-all font-medium",
        isActiveLink(link.url)
          ? "bg-primary bg-opacity-10 text-primary font-semibold"
          : "text-gray70 dark:text-slate-500 hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:hover:text-primary"
      )}
    >
      {link.icon}
      <span>{link.title}</span>
    </Link>
  );
};

export default MenuLink;
