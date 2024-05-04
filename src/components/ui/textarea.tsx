import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-transparent focus:border-primary bg-white dark:bg-grayDarker px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500  disabled:cursor-not-allowed disabled:opacity-50  dark:placeholder:text-slate-400 resize-none font-medium focus-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
