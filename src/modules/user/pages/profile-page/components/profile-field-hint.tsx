import {
  FormDescription,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { cn } from "@/shared/utils";

export interface ProfileFieldHintProps {
  hint?: React.ReactNode;
  /** Bộ đếm ký tự bên phải, ví dụ "42/160" */
  counter?: React.ReactNode;
  isCounterOver?: boolean;
}

// Dưới ô chỉ một dòng: có lỗi thì câu lỗi thay chỗ gợi ý, bộ đếm vẫn giữ bên phải
export function ProfileFieldHint({
  hint,
  counter,
  isCounterOver,
}: ProfileFieldHintProps) {
  const { error } = useFormField();

  if (!error && !hint && !counter) return null;

  return (
    <div className="flex items-start justify-between gap-3">
      {error && (
        <FormMessage className="text-xs font-normal text-red-600 dark:text-red-400" />
      )}
      {!error && hint && (
        <FormDescription className="min-w-0 text-pretty text-xs text-muted dark:text-muted">
          {hint}
        </FormDescription>
      )}
      {counter && (
        <span
          className={cn(
            "ml-auto shrink-0 text-xs tabular-nums text-muted",
            isCounterOver && "text-red-600 dark:text-red-400",
          )}
        >
          {counter}
        </span>
      )}
    </div>
  );
}
