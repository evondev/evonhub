"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { categoryFormSchema } from "../../../schemas";
import { CategoryFormValues, CategoryManageItem } from "../../../types";

interface CategoryFormProps {
  category?: CategoryManageItem;
  isSubmitting: boolean;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
}

const labelClassName =
  "block w-fit text-sm font-medium leading-5 text-foreground";

const messageClassName = "text-xs font-normal text-red-600 dark:text-red-400";

/** Nằm trong nội dung hộp thoại: mỗi lần mở là mount lại, giá trị đầu luôn mới */
export function CategoryForm({
  category,
  isSubmitting,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className={labelClassName}>Tên danh mục</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: React" autoFocus {...field} />
              </FormControl>
              <FormMessage className={messageClassName} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className={labelClassName}>Đường dẫn</FormLabel>
              <FormControl>
                <Input placeholder="react" {...field} />
              </FormControl>
              <FormDescription className="text-pretty text-xs text-muted dark:text-muted">
                Để trống thì tự tạo từ tên. Dùng trên link lọc, ví dụ
                /videos?danhmuc=react
              </FormDescription>
              <FormMessage className={messageClassName} />
            </FormItem>
          )}
        />
        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="h-11 md:h-10"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="h-11 md:h-10"
            isLoading={isSubmitting}
          >
            {category ? "Lưu" : "Thêm danh mục"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
