import * as React from "react";

import { cn } from "@/lib/utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  // default 20px cạnh chữ text-sm; sm 16px trong bảng, menu, dòng text-xs
  size?: "default" | "sm";
}

// Viền dày màu nhấn, phần lõi trắng còn lại chính là chấm: không cần phần tử phụ
function getRadioClassName(size: RadioProps["size"]) {
  const isSmall = size === "sm";

  return cn(
    "shrink-0 cursor-pointer appearance-none rounded-full border-[1.5px] border-border-strong bg-surface outline-none transition-[border-color,border-width]",
    // Rê chỉ đậm viền khi chưa chọn: ô đã chọn giữ nguyên màu nhấn
    "[&:not(:checked):hover]:border-foreground",
    "checked:border-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
    isSmall && "size-4 checked:border-[5px]",
    !isSmall && "size-5 checked:border-[6px]",
  );
}

// Dựng trên <input type="radio"> thật: phím mũi tên trong nhóm, form submit,
// trình đọc màn hình có sẵn. Bọc nhóm trong <fieldset> + <legend>, mỗi ô trong
// <label> để bấm cả nhãn.
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size = "default", ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn(getRadioClassName(size), className)}
      {...props}
    />
  ),
);
Radio.displayName = "Radio";

export { Radio };
