import { CHAT_PATH } from "@/shared/constants/common.constants";
import { MenuLinkItemProps, MenuLinkSignal } from "@/shared/types";
import { isMenuLinkActive } from "@/shared/utils";
import { MenuLink } from "./menu-link";

interface SidebarLinkListProps {
  links: MenuLinkItemProps[];
  pathname: string;
  isCollapsed: boolean;
  /** Tín hiệu của phòng chat, chỉ gắn vào mục Trò chuyện */
  chatSignal?: MenuLinkSignal | null;
}

/** Một nhóm mục trên sidebar */
export function SidebarLinkList({
  links,
  pathname,
  isCollapsed,
  chatSignal,
}: SidebarLinkListProps) {
  return (
    <ul className="flex flex-col gap-1.5">
      {links.map((link) => (
        <li key={link.url}>
          <MenuLink
            link={link}
            isActive={isMenuLinkActive(link, pathname)}
            isCollapsed={isCollapsed}
            signal={link.url === CHAT_PATH ? chatSignal : null}
          />
        </li>
      ))}
    </ul>
  );
}
