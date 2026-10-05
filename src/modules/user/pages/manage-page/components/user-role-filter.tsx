"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { Check, ChevronDown } from "lucide-react";
import { USER_ROLE_FILTER_OPTIONS } from "../../../constants/user-manage.constants";
import { UserRoleFilter as UserRoleFilterValue } from "../../../types/user-manage.types";

interface UserRoleFilterProps {
  value: UserRoleFilterValue;
  onChange: (role: UserRoleFilterValue) => void;
  className?: string;
}

export function UserRoleFilter({
  value,
  onChange,
  className,
}: UserRoleFilterProps) {
  const currentOption =
    USER_ROLE_FILTER_OPTIONS.find((option) => option.value === value) ||
    USER_ROLE_FILTER_OPTIONS[0];
  const isFiltering = currentOption.value !== "all";

  return (
    // modal={false}: menu mở không khoá cuộn trang, thanh cuộn không ẩn hiện làm giật
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* Cùng trạng thái mở với ô Select: viền màu nhấn + ring-2, nền giữ trắng, không hover */}
        <Button
          variant="outline"
          className={cn(
            "h-11 shrink-0 gap-1.5 whitespace-nowrap px-3 hover:bg-surface data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15 md:h-10",
            className,
          )}
        >
          {/* Chưa lọc thì nút chỉ ghi "Vai trò"; đang lọc thì ghi tên vai trò */}
          {isFiltering && (
            <span className="font-medium text-foreground">
              {currentOption.label}
            </span>
          )}
          {!isFiltering && <span className="text-foreground">Vai trò</span>}
          <ChevronDown className="size-4 text-muted" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-48 flex-col gap-1 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        {USER_ROLE_FILTER_OPTIONS.map((option) => {
          const isCurrent = option.value === currentOption.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onChange(option.value)}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "flex h-9 cursor-pointer items-center justify-between rounded-lg px-2.5 text-sm focus:text-foreground dark:focus:text-foreground",
                isCurrent &&
                  "bg-item-active font-medium text-foreground focus:bg-item-active dark:focus:bg-item-active",
                !isCurrent &&
                  "text-foreground/80 focus:bg-item-hover dark:focus:bg-item-hover",
              )}
            >
              {option.label}
              {isCurrent && <Check className="size-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
