import { cn } from "@/shared/utils";
import { ComponentProps } from "react";

export interface TagProps extends ComponentProps<"div"> {}

export function Tag({ className, ...props }: TagProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between px-3 py-1 rounded-full bg-white dark:bg-grayDarkest dark:text-gray-200 text-xs border border-gray-200 font-medium",
        className
      )}
      {...props}
    ></div>
  );
}
