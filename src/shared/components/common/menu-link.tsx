import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuLinkItemProps } from "@/shared/types";
import { cn } from "@/shared/utils";
import Link from "next/link";

interface MenuLinkProps {
  link: MenuLinkItemProps;
  isActive: boolean;
  isCollapsed: boolean;
}

function getMenuLinkBadge(link: MenuLinkItemProps) {
  if (link.isHot) return "Hot";
  if (link.isNew) return "New";
  if (link.isFree) return "Free";

  return "";
}

export function MenuLink({ link, isActive, isCollapsed }: MenuLinkProps) {
  const badge = getMenuLinkBadge(link);

  return (
    // Tooltip chỉ bật lúc thu gọn: lúc mở thì tên đã nằm ngay cạnh icon.
    <Tooltip open={isCollapsed ? undefined : false}>
      <TooltipTrigger asChild>
        {/* Icon đứng yên ở cả hai trạng thái: không justify-center, không đổi
            padding. Thu gọn thì mép sidebar cắt dần phần chữ. */}
        <Link
          target={link.isExternal ? "_blank" : "_self"}
          href={link.url}
          aria-current={isActive ? "page" : undefined}
          aria-label={isCollapsed ? link.title : undefined}
          className={cn(
            "flex h-10 w-full items-center gap-2.5 whitespace-nowrap rounded-xl px-3 text-sm text-foreground/70 outline-none transition-colors",
            !isActive && "hover:bg-item-hover hover:text-foreground",
            isActive && "bg-item-active font-medium text-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
          >
            {link.icon}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate transition-opacity duration-150 motion-reduce:transition-none",
              isCollapsed && "opacity-0",
            )}
          >
            {link.title}
          </span>
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
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="rounded-lg border-0 bg-foreground px-2.5 py-1.5 text-xs font-medium text-surface shadow-none dark:border-0 dark:bg-foreground dark:text-background"
      >
        {link.title}
      </TooltipContent>
    </Tooltip>
  );
}
