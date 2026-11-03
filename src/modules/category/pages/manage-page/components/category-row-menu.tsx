"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { CategoryManageItem } from "../../../types";

interface CategoryRowMenuProps {
  category: CategoryManageItem;
  onEdit: (category: CategoryManageItem) => void;
  onDelete: (category: CategoryManageItem) => void;
}

const menuItemClassName =
  "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-foreground/80 focus:bg-item-hover focus:text-foreground dark:focus:bg-item-hover dark:focus:text-foreground";

export function CategoryRowMenu({
  category,
  onEdit,
  onDelete,
}: CategoryRowMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Thao tác với ${category.name}`}
          className="size-9 rounded-lg hover:bg-foreground/[0.08] data-[state=open]:bg-foreground/[0.08] data-[state=open]:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-48 flex-col gap-1 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        <DropdownMenuItem
          className={menuItemClassName}
          onSelect={() => onEdit(category)}
        >
          <Pencil className="size-4 text-muted" />
          Sửa
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-border dark:bg-border" />
        <DropdownMenuItem
          className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-rose-700 focus:bg-rose-500/10 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10 dark:focus:text-rose-400"
          onSelect={() => onDelete(category)}
        >
          <Trash2 className="size-4" />
          Xoá
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
