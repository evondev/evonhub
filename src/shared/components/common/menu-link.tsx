import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuLinkItemProps, MenuLinkSignal } from "@/shared/types";
import { cn } from "@/shared/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MenuLinkSignalBadge } from "./menu-link-signal-badge";
import { MenuLinkSignalDot } from "./menu-link-signal-dot";

interface MenuLinkProps {
  link: MenuLinkItemProps;
  isActive: boolean;
  isCollapsed: boolean;
  /** Tín hiệu sống của mục, vd phòng chat đang có người */
  signal?: MenuLinkSignal | null;
}

function getMenuLinkBadge(link: MenuLinkItemProps) {
  if (link.isHot) return "Hot";
  if (link.isNew) return "New";
  if (link.isFree) return "Free";

  return "";
}

/** Thu gọn thì aria-label thay chữ trong link nên phải nói cả tín hiệu */
function getCollapsedLabel(link: MenuLinkItemProps, signalDescription: string) {
  const title = link.isExternal ? `${link.title} (mở tab mới)` : link.title;

  if (!signalDescription) return title;

  return `${title}, ${signalDescription}`;
}

export function MenuLink({
  link,
  isActive,
  isCollapsed,
  signal,
}: MenuLinkProps) {
  const badge = getMenuLinkBadge(link);
  const signalDescription = signal?.description || "";

  return (
    // Tooltip chỉ bật lúc thu gọn: lúc mở thì tên đã nằm ngay cạnh icon.
    <Tooltip open={isCollapsed ? undefined : false}>
      <TooltipTrigger asChild>
        {/* Icon đứng yên ở cả hai trạng thái: không justify-center, không đổi
            padding. Thu gọn thì mép sidebar cắt dần phần chữ. Link thu gọn rộng
            40px, icon 18px cách mép 11px là nằm đúng tâm ô nền. */}
        <Link
          target={link.isExternal ? "_blank" : "_self"}
          rel={link.isExternal ? "noopener noreferrer" : undefined}
          href={link.url}
          aria-current={isActive ? "page" : undefined}
          aria-label={
            isCollapsed ? getCollapsedLabel(link, signalDescription) : undefined
          }
          className={cn(
            "flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-xl px-[11px] text-sm font-normal text-foreground/80 outline-none transition-colors",
            !isActive && "hover:bg-item-hover hover:text-foreground",
            isActive && "bg-item-active font-medium text-foreground",
            signal?.hasUnread && "font-medium text-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className="relative flex size-[18px] shrink-0 items-center justify-center [&>svg]:size-[18px]"
          >
            {link.icon}
            {/* Thu gọn thì không còn chỗ cho số người: chỉ còn chấm ở góc icon */}
            {signal && isCollapsed && (
              <MenuLinkSignalDot
                isUnread={signal.hasUnread}
                isPinging={signal.isLive}
                hasRing
                className="absolute -right-1 -top-1"
              />
            )}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate transition-opacity duration-150 motion-reduce:transition-none",
              isCollapsed && "opacity-0",
            )}
          >
            {link.title}
            {link.isExternal && <span className="sr-only"> (mở tab mới)</span>}
            {signalDescription && (
              <span className="sr-only">, {signalDescription}</span>
            )}
          </span>
          {/* Link ra trang khác: mũi tên báo trước là mở tab mới */}
          {link.isExternal && (
            <ArrowUpRight
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 text-muted transition-opacity duration-150 motion-reduce:transition-none",
                isCollapsed && "opacity-0",
              )}
            />
          )}
          {badge && (
            <span
              className={cn(
                "shrink-0 text-xs text-muted transition-opacity duration-150 motion-reduce:transition-none",
                isActive && "text-foreground",
                isCollapsed && "opacity-0",
              )}
            >
              {badge}
            </span>
          )}
          {signal && (
            <MenuLinkSignalBadge signal={signal} isCollapsed={isCollapsed} />
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="rounded-lg border-0 bg-foreground px-2.5 py-1.5 text-xs font-medium text-surface shadow-none dark:border-0 dark:bg-foreground dark:text-background"
      >
        {link.title}
        {signalDescription && (
          <span className="block font-normal opacity-70">
            {signalDescription}
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
