import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl text-center text-sm font-medium leading-tight outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        // Việc nguy hiểm: nền đỏ mờ, chữ đỏ, luôn hiện
        destructive:
          "bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-400",
        outline:
          "border border-border-strong bg-surface text-foreground hover:bg-button-hover",
        secondary: "bg-foreground/5 text-foreground hover:bg-foreground/10",
        ghost: "text-muted hover:bg-foreground/5 hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const buttonClassName = cn(buttonVariants({ variant, size, className }), {
      "button-loading": isLoading,
    });

    // Slot chỉ nhận đúng một phần tử con, nên asChild thì đưa thẳng children
    // xuống, không bọc thêm spinner.
    if (asChild) {
      return (
        <Slot className={buttonClassName} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={buttonClassName}
        ref={ref}
        {...props}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading || undefined}
      >
        {isLoading ? (
          <span className="invisible opacity-0">{children}</span>
        ) : (
          children
        )}
        {isLoading && (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
