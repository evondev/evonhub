import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { EXPLORE_SORT_OPTIONS } from "../../../constants";
import { ExploreFilters, ExploreLinkBase } from "../../../types";
import { buildExploreHref } from "../../../utils";

interface ExploreSortMenuProps {
  filters: ExploreFilters;
  linkBase: ExploreLinkBase;
}

export function ExploreSortMenu({ filters, linkBase }: ExploreSortMenuProps) {
  const currentOption =
    EXPLORE_SORT_OPTIONS.find((option) => option.value === filters.sort) ||
    EXPLORE_SORT_OPTIONS[0];

  return (
    // modal={false}: menu mở không khoá cuộn trang, thanh cuộn không ẩn hiện làm giật
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* Cùng trạng thái mở với ô Select: viền màu nhấn + ring-2, nền giữ trắng.
            Không hover: nền rê --button-hover gần trùng nền trang, mũi tên đã đủ báo bấm được */}
        <Button
          variant="outline"
          className="gap-1.5 px-3 hover:bg-surface data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15"
        >
          <span className="text-muted">Sắp xếp:</span>
          <span className="font-medium text-foreground">
            {currentOption.label}
          </span>
          <ChevronDown className="size-4 text-muted" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-44 flex-col gap-1 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        {EXPLORE_SORT_OPTIONS.map((option) => {
          const isCurrent = option.value === currentOption.value;

          return (
            // Class đặt ở DropdownMenuItem để cn() gộp với class mặc định (rounded-sm...);
            // đặt ở Link thì Slot chỉ nối chuỗi, rounded-sm vẫn thắng
            <DropdownMenuItem
              key={option.value}
              asChild
              className={cn(
                "flex h-9 cursor-pointer items-center justify-between rounded-lg px-2.5 text-sm focus:text-foreground dark:focus:text-foreground",
                isCurrent &&
                  "bg-item-active font-medium text-foreground focus:bg-item-active dark:focus:bg-item-active",
                !isCurrent &&
                  "text-foreground/80 focus:bg-item-hover dark:focus:bg-item-hover",
              )}
            >
              <Link
                href={buildExploreHref(linkBase, {
                  ...filters,
                  sort: option.value,
                  page: 1,
                })}
                scroll={false}
                aria-current={isCurrent ? "true" : undefined}
              >
                {option.label}
                {isCurrent && <Check className="size-4" />}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
