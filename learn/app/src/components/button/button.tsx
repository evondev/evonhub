"use client";

import type { ComponentProps, MouseEvent } from "react";
import { LoaderCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type ButtonVariant = "outline" | "primary" | "secondary" | "ghost";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  isLoading?: boolean;
}

function getVariantClasses(variant: ButtonVariant) {
  return cn(
    variant === "outline" && "border border-border-strong bg-surface text-foreground hover:bg-button-hover",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-hover",
    variant === "secondary" && "bg-secondary text-foreground hover:bg-secondary-hover",
    variant === "ghost" && "bg-transparent text-muted hover:bg-foreground/5 hover:text-foreground",
  );
}

export default function Button({
  variant = "outline",
  icon: Icon,
  isLoading = false,
  type = "button",
  className,
  children,
  onClick,
  ...buttonProps
}: ButtonProps) {
  // Đang xử lý thì chặn bấm bằng aria-disabled, không dùng disabled để nút giữ được tiêu điểm.
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isLoading) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  }

  return (
    <button
      type={type}
      aria-disabled={isLoading || undefined}
      aria-busy={isLoading || undefined}
      onClick={handleClick}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl",
        "min-h-10 px-4 py-2 text-sm font-medium transition-colors",
        "max-w-full text-center leading-tight [overflow-wrap:anywhere]",
        "outline-hidden",
        "disabled:cursor-not-allowed disabled:not-aria-busy:opacity-50",
        "aria-busy:cursor-progress",
        getVariantClasses(variant),
        className,
      )}
      {...buttonProps}
    >
      {isLoading && <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden />}
      {!isLoading && Icon && <Icon className="size-4 shrink-0" aria-hidden />}
      {children}
    </button>
  );
}
