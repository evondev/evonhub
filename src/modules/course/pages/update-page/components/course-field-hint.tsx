import {
  FormDescription,
  FormMessage,
  useFormField,
} from "@/components/ui/form";

export interface CourseFieldHintProps {
  hint?: React.ReactNode;
}

// Dưới ô chỉ một dòng: có lỗi thì câu lỗi thay chỗ gợi ý
export function CourseFieldHint({ hint }: CourseFieldHintProps) {
  const { error } = useFormField();

  if (error) {
    return (
      <FormMessage className="text-xs font-normal text-red-600 dark:text-red-400" />
    );
  }

  if (!hint) return null;

  return (
    <FormDescription className="text-pretty text-xs text-muted dark:text-muted">
      {hint}
    </FormDescription>
  );
}
