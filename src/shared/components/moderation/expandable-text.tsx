"use client";

import { Button } from "@/components/ui/button";
import { cn, isLongText } from "@/shared/utils";
import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  className?: string;
}

/** Nội dung đầy đủ để đọc rồi quyết; dài quá ba dòng thì gập, có "Xem thêm" */
export function ExpandableText({ text, className }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = isLongText(text);

  return (
    <div className={className}>
      <p
        className={cn(
          // anywhere: link dài không dấu cách vẫn xuống dòng, không đẩy dòng rộng ra
          "text-pretty text-sm/6 text-foreground [overflow-wrap:anywhere]",
          // Gập thì gộp các đoạn thành một: giữ xuống dòng thì chỗ cắt rơi vào
          // dòng trống, còn lại một dòng "…" đứng riêng
          isLong && !isExpanded && "line-clamp-3",
          (!isLong || isExpanded) && "whitespace-pre-line",
        )}
      >
        {text}
      </p>
      {isLong && (
        <Button
          variant="link"
          aria-expanded={isExpanded}
          onClick={() =>
            setIsExpanded((isCurrentlyExpanded) => !isCurrentlyExpanded)
          }
          // py-1.5 -my-1.5: chỗ bấm cao 32px mà dòng chữ không giãn ra
          className="-my-1.5 h-auto p-0 py-1.5 text-sm font-medium"
        >
          {isExpanded && "Thu gọn"}
          {!isExpanded && "Xem thêm"}
        </Button>
      )}
    </div>
  );
}
