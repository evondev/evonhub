"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  // default track 44×24, núm 20px; sm track 36×20, núm 16px cho dòng dày
  size?: "default" | "sm";
}

// Track = 2 × núm + 4px (đệm p-0.5 hai bên), núm chạy đúng bằng cỡ núm
function getTrackClassName(size: SwitchProps["size"]) {
  const isSmall = size === "sm";

  return cn(
    "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors",
    // Vùng bấm nới ra 8px mỗi phía, hình vẫn giữ 24px
    "before:absolute before:-inset-2",
    "data-[state=unchecked]:bg-muted/40 data-[state=unchecked]:hover:bg-muted/60",
    "data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary/90",
    "disabled:cursor-not-allowed disabled:opacity-50",
    isSmall && "h-5 w-9",
    !isSmall && "h-6 w-11",
  );
}

function getThumbClassName(size: SwitchProps["size"]) {
  const isSmall = size === "sm";

  return cn(
    "pointer-events-none block rounded-full bg-surface shadow-sm transition-transform motion-reduce:transition-none",
    "data-[state=checked]:bg-primary-foreground data-[state=unchecked]:translate-x-0",
    isSmall && "size-4 data-[state=checked]:translate-x-4",
    !isSmall && "size-5 data-[state=checked]:translate-x-5",
  );
}

// Công tắc có hiệu lực ngay khi gạt. Cần bấm Lưu mới có hiệu lực thì dùng Checkbox.
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = "default", ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(getTrackClassName(size), className)}
    {...props}
  >
    <SwitchPrimitives.Thumb className={getThumbClassName(size)} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
