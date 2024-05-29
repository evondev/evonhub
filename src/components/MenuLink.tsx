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
        "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all font-medium",
        isActiveLink(link.url)
          ? "bg-primary bg-opacity-10 text-primary font-medium svg-animate"
          : "text-gray70 dark:text-slate-500 hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:hover:text-primary"
      )}
    >
      <div className="size-5 flex items-center justify-center">{link.icon}</div>
      <span>{link.title}</span>
    </Link>
  );
};

export default MenuLink;
