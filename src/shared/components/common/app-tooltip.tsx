"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TOOLTIP_DELAY_MS } from "@/shared/constants/common.constants";
import { cn } from "@/shared/utils";
import { Ref } from "react";

interface AppTooltipProps {
  content: React.ReactNode;
  /** Một phần tử nhận ref: nút, link, span */
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Nội dung người dùng đặt (tên, email, từ khoá): cho xuống dòng trong bề rộng
   * tối đa, kẻo tên dài tràn khỏi màn. Nhãn nút ngắn thì giữ một dòng
   */
  isWrapped?: boolean;
  /** Điều khiển mở đóng từ ngoài, như TruncateTooltip chỉ mở khi chữ bị cắt */
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  triggerRef?: Ref<HTMLButtonElement>;
}

/** Tooltip của app thay cho title: hiện sau 400ms, đảo màu, chỉ mờ dần */
export function AppTooltip({
  content,
  children,
  side = "top",
  isWrapped = false,
  open,
  onOpenChange,
  triggerRef,
}: AppTooltipProps) {
  return (
    <TooltipProvider delayDuration={TOOLTIP_DELAY_MS}>
      <Tooltip open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger ref={triggerRef} asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            isWrapped &&
              "max-w-[min(20rem,calc(100vw-1rem))] whitespace-normal [overflow-wrap:anywhere]",
            !isWrapped && "whitespace-nowrap",
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
