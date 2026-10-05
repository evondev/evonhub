import { cn } from "@/shared/utils";
import { forwardRef } from "react";

export interface InputWithAddonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Chữ cố định trước giá trị, ví dụ "/course/" */
  leadingText?: string;
  /** Chữ cố định sau giá trị, ví dụ "đ" */
  trailingText?: string;
}

// Khung mang viền và vòng focus của ô nhập (form-styles), input bên trong trong
// suốt, nên tiền tố và giá trị nằm cùng một ô. Props (id, aria-*) đi thẳng vào input.
export const InputWithAddon = forwardRef<HTMLInputElement, InputWithAddonProps>(
  ({ leadingText, trailingText, className, disabled, ...props }, ref) => {
    const isInvalid = props["aria-invalid"] === true;

    return (
      <div
        className={cn(
          "form-styles flex h-11 items-center gap-1 py-0 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 md:h-10 dark:focus-within:border-primary",
          isInvalid && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {leadingText && (
          <span className="shrink-0 select-none text-sm font-normal text-muted">
            {leadingText}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium tabular-nums outline-none placeholder:text-muted disabled:cursor-not-allowed"
          {...props}
        />
        {trailingText && (
          <span className="shrink-0 select-none text-sm font-normal text-muted">
            {trailingText}
          </span>
        )}
      </div>
    );
  },
);
InputWithAddon.displayName = "InputWithAddon";
