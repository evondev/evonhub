"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  CHAT_MESSAGE_MENU_ITEM_CLASS_NAME,
  chatReactionEmojis,
} from "../../../constants";

interface ChatMessageMenuProps {
  ariaLabel: string;
  /** Tin mình nằm bên phải nên menu canh mép phải nút */
  align: "start" | "end";
  /** Emoji mình đang thả trên tin, null là chưa thả */
  viewerReaction: string | null;
  /** Tin của mình, hoặc mình là mod */
  canDelete: boolean;
  onReact: (emoji: string) => void;
  onDelete: () => void;
}

/**
 * Nút ⋯ cạnh bong bóng, bấm ra menu thao tác với tin: hàng emoji cố định để
 * thả reaction, dưới là xoá (tin của mình, hoặc mọi tin nếu là mod). Ẩn tới
 * khi rê vào tin, máy cảm ứng không rê được thì luôn hiện
 */
export function ChatMessageMenu({
  ariaLabel,
  align,
  viewerReaction,
  canDelete,
  onReact,
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
        className="flex min-w-44 flex-col gap-1 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        {/* Mỗi emoji là một mục menu: phím mũi tên đi qua được, chọn xong menu tự đóng */}
        <div className="flex items-center gap-0.5" aria-label="Thả cảm xúc">
          {chatReactionEmojis.map((reactionEmoji) => {
            const isSelected = viewerReaction === reactionEmoji.symbol;

            return (
              <DropdownMenuItem
                key={reactionEmoji.symbol}
                aria-label={
                  isSelected ? `Bỏ ${reactionEmoji.label}` : reactionEmoji.label
                }
                title={reactionEmoji.label}
                className={cn(
                  "flex size-9 cursor-pointer items-center justify-center rounded-lg p-0 text-xl leading-none transition-transform hover:scale-110 focus:bg-item-hover dark:focus:bg-item-hover",
                  isSelected && "bg-primary/10 dark:bg-primary/15",
                )}
                onSelect={() => onReact(reactionEmoji.symbol)}
              >
                {reactionEmoji.symbol}
              </DropdownMenuItem>
            );
          })}
        </div>
        {canDelete && (
          <>
            <DropdownMenuSeparator className="mx-1 my-0 bg-border" />
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
