"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Bấm là đổi ngay giữa sáng và tối, không mở menu: menu Radix khoá cuộn
  // trang nên thanh cuộn ẩn hiện làm cả trang giật.
  function handleToggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Đổi giao diện sáng tối"
      className="size-9 rounded-xl"
      onClick={handleToggleTheme}
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:block" />
    </Button>
  );
}
