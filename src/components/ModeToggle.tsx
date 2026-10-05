"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_MENU_ITEM_CLASS_NAME =
  "h-10 cursor-pointer rounded-xl px-3 text-foreground focus:bg-item-hover dark:focus:bg-item-hover";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Đổi giao diện sáng tối"
          className="size-9 rounded-lg data-[state=open]:bg-foreground/5"
        >
          <Moon className="size-4 dark:hidden" />
          <Sun className="hidden size-4 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-2xl border-border bg-surface p-1 dark:border-border dark:bg-surface"
      >
        <DropdownMenuItem
          className={THEME_MENU_ITEM_CLASS_NAME}
          onClick={() => setTheme("light")}
        >
          Sáng
        </DropdownMenuItem>
        <DropdownMenuItem
          className={THEME_MENU_ITEM_CLASS_NAME}
          onClick={() => setTheme("dark")}
        >
          Tối
        </DropdownMenuItem>
        <DropdownMenuItem
          className={THEME_MENU_ITEM_CLASS_NAME}
          onClick={() => setTheme("system")}
        >
          Theo máy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
