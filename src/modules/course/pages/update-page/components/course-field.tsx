import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/shared/utils";
import { CourseFieldHint } from "./course-field-hint";

export interface CourseFieldProps {
  label: string;
  hint?: React.ReactNode;
  isRequired?: boolean;
  /** Nút nhỏ nằm cùng hàng label, bên phải (ví dụ AI gợi ý) */
  labelAction?: React.ReactNode;
  className?: string;
  /** Một phần tử nhận id, aria-invalid từ FormControl */
  children: React.ReactNode;
}

export function CourseField({
  label,
  hint,
  isRequired,
  labelAction,
  className,
  children,
}: CourseFieldProps) {
  const fieldLabel = (
    <FormLabel className="block w-fit cursor-pointer text-sm font-medium leading-5 text-foreground">
      {label}
      {isRequired && (
        <span aria-hidden="true" className="text-red-600 dark:text-red-400">
          {" "}
          *
        </span>
      )}
    </FormLabel>
  );

  return (
    <FormItem className={cn("min-w-0 space-y-1.5", className)}>
      {labelAction ? (
        <div className="flex items-center justify-between gap-3">
          {fieldLabel}
          {labelAction}
        </div>
      ) : (
        fieldLabel
      )}
      <FormControl>{children}</FormControl>
      <CourseFieldHint hint={hint} />
    </FormItem>
  );
}
