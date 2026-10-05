"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  // default 20px cạnh chữ text-sm; sm 16px trong bảng, menu, dòng text-xs
  size?: "default" | "sm";
}

function getCheckboxClassName(size: CheckboxProps["size"]) {
  const isSmall = size === "sm";

  return cn(
    "peer inline-grid shrink-0 cursor-pointer place-items-center border-[1.5px] border-border-strong bg-surface text-primary-foreground outline-none transition-colors",
    // Rê chỉ đậm viền khi chưa chọn: ô đã chọn giữ nguyên màu nhấn
    "data-[state=unchecked]:hover:border-foreground",
    "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
    "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
    isSmall && "size-4 rounded",
    !isSmall && "size-5 rounded-md",
  );
}

// Dựng trên Radix: phím Space, aria-checked, ba trạng thái (checked =
// "indeterminate" hiện dấu trừ) đều có sẵn. Tab tới không vẽ vòng focus.
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = "default", ...props }, ref) => {
  const iconClassName = cn(
    "stroke-[3]",
    size === "sm" && "size-3",
    size !== "sm" && "size-3.5",
  );

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(getCheckboxClassName(size), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="group grid place-items-center">
        <Check
          className={cn(iconClassName, "group-data-[state=indeterminate]:hidden")}
        />
        <Minus
          className={cn(iconClassName, "hidden group-data-[state=indeterminate]:block")}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
