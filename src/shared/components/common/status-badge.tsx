import { StatusBadgeVariant } from "@/shared/types";
import { cn } from "@/shared/utils";
import { ComponentProps } from "react";

export interface StatusBadgeProps extends ComponentProps<"span"> {
  children: React.ReactNode;
  className?: string;
  variant: StatusBadgeVariant;
}

export function StatusBadge({
  children,
  className,
  ...props
}: StatusBadgeProps) {
  const variantClassNames: Record<StatusBadgeVariant, string> = {
    success: "bg-green-500 bg-opacity-10 text-green-500",
    error: "bg-red-500 bg-opacity-10 text-red-500",
    warning: "bg-orange-500 bg-opacity-10 text-orange-500",
    info: "bg-blue-500 bg-opacity-10 text-blue-500",
    default: "bg-gray-500 bg-opacity-10 text-gray-500",
  };
  return (
    <span
      className={cn(
        "py-1 px-3 rounded-xl font-bold border border-current text-xs whitespace-nowrap bg-opacity-10 cursor-pointer w-[100px] inline-flex justify-center",
        className,
        variantClassNames[props.variant]
      )}
      {...props}
    >
      {children}
    </span>
  );
}
