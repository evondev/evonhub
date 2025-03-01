import { cn } from "@/shared/utils";
import { ComponentProps } from "react";

export interface LabelStatusProps extends ComponentProps<"span"> {
  children: React.ReactNode;
  className?: string;
}

export function LabelStatus({
  children,
  className,
  ...props
}: LabelStatusProps) {
  return (
    <span
      className={cn(
        className,
        "py-1 px-3 rounded-lg font-bold border border-current text-xs whitespace-nowrap bg-opacity-10"
      )}
      {...props}
    >
      {children}
    </span>
  );
}
