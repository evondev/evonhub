"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { useState } from "react";
import { chatEmojis } from "../../../constants";

interface ChatEmojiPickerProps {
  isDisabled?: boolean;
  onSelect: (symbol: string) => void;
}

/** Bảng emoji hay dùng; chọn xong vẫn mở để chèn liền vài cái */
export function ChatEmojiPicker({ isDisabled, onSelect }: ChatEmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          aria-label="Chèn emoji"
          disabled={isDisabled}
          className="size-10 shrink-0 rounded-2xl px-0 text-muted hover:bg-foreground/5 hover:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground"
        >
          <Smile className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={12}
        className="w-72 rounded-2xl border-border bg-surface p-2 text-foreground shadow-popover dark:border-border dark:bg-surface"
        // Giữ con trỏ trong ô nhập để chèn đúng chỗ đang gõ
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-8 gap-0.5">
          {chatEmojis.map((emoji) => (
            <Button
              key={emoji.symbol}
              type="button"
              title={emoji.label}
              aria-label={emoji.label}
              onClick={() => onSelect(emoji.symbol)}
              className="size-8 rounded-lg px-0 text-xl leading-none hover:bg-foreground/5"
            >
              {emoji.symbol}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
