import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/shared/utils";
import { LessonFieldHint } from "./lesson-field-hint";

export interface LessonFieldProps {
  label: string;
  hint?: React.ReactNode;
  isRequired?: boolean;
  className?: string;
  /** Một phần tử nhận id, aria-invalid từ FormControl */
  children: React.ReactNode;
}

export function LessonField({
  label,
  hint,
  isRequired,
  className,
  children,
}: LessonFieldProps) {
  return (
    <FormItem className={cn("min-w-0 space-y-1.5", className)}>
      <FormLabel className="block w-fit cursor-pointer text-sm font-medium leading-5 text-foreground">
        {label}
        {isRequired && (
          <span aria-hidden="true" className="text-red-600 dark:text-red-400">
            {" "}
            *
          </span>
        )}
      </FormLabel>
      <FormControl>{children}</FormControl>
      <LessonFieldHint hint={hint} />
    </FormItem>
  );
}
