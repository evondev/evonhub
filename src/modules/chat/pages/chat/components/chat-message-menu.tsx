"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { CHAT_MESSAGE_MENU_ITEM_CLASS_NAME } from "../../../constants";

interface ChatMessageMenuProps {
  ariaLabel: string;
  /** Tin mình nằm bên phải nên menu canh mép phải nút */
  align: "start" | "end";
  onDelete: () => void;
}

/**
 * Nút ⋯ cạnh bong bóng, bấm ra menu thao tác với tin. Giờ chỉ có xoá (tin của
 * mình, hoặc mọi tin nếu là mod); thêm "Báo cáo" sau này là thêm một mục vào
 * đây. Ẩn tới khi rê vào tin, máy cảm ứng không rê được thì luôn hiện
 */
export function ChatMessageMenu({
  ariaLabel,
  align,
  onDelete,
}: ChatMessageMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
          className="size-8 shrink-0 rounded-lg opacity-0 focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground data-[state=open]:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="flex w-44 flex-col gap-1 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        {/* Mục menu nguy hiểm: trung tính lúc thường, rê vào mới đỏ */}
        <DropdownMenuItem
          className={cn(
            CHAT_MESSAGE_MENU_ITEM_CLASS_NAME,
            "focus:bg-rose-500/10 focus:text-rose-700 dark:focus:bg-rose-500/10 dark:focus:text-rose-400 [&:focus>svg]:text-current",
          )}
          onSelect={onDelete}
        >
          <Trash2 className="size-4 text-muted" aria-hidden />
          Xoá tin nhắn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
