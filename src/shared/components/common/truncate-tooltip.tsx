"use client";

import { isTextTruncated } from "@/shared/utils";
import { useRef, useState } from "react";
import { AppTooltip } from "./app-tooltip";

interface TruncateTooltipProps {
  /** Chữ đầy đủ; email thì truyền <EmailText /> để xuống dòng trước "@" */
  content: React.ReactNode;
  /** Phần tử đang cắt chữ (truncate, line-clamp) */
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
}

/** Tooltip chữ đầy đủ, chỉ mở khi chữ thật sự bị cắt; chữ vừa khung thì rê vào không có gì */
export function TruncateTooltip({
  content,
  children,
  side = "top",
}: TruncateTooltipProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenChange(isNextOpen: boolean) {
    if (isNextOpen && !isTextTruncated(triggerRef.current)) return;

    setIsOpen(isNextOpen);
  }

  return (
    <AppTooltip
      content={content}
      side={side}
      isWrapped
      open={isOpen}
      onOpenChange={handleOpenChange}
      triggerRef={triggerRef}
    >
      {children}
    </AppTooltip>
  );
}
