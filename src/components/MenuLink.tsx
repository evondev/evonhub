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
      href={link.url}
      className={twMerge(
        "flex items-center gap-4 p-4 rounded-lg transition-all",
        isActiveLink(link.url)
          ? "bg-gradientPrimary text-white font-semibold"
          : "text-gray70 hover:bg-grayef hover:text-grayPrimary font-medium dark:hover:bg-grayDarkest dark:hover:bg-opacity-20 dark:hover:text-white"
      )}
    >
      {link.icon}
      <span>{link.title}</span>
    </Link>
  );
};

export default MenuLink;
