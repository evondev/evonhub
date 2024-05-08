import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { baseButtonClassName, primaryButtonClassName } from "@/constants";
import { updateLesson } from "@/lib/actions/lesson.action";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { z } from "zod";
const formSchema = z.object({
  video: z.string().optional(),
  content: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  order: z.number().optional(),
});

const CourseContentLesson = ({
  lessonId,
  slug,
  lesson,
}: {
  lessonId: string;
  slug: string;
  lesson: {
    video: string;
    content: string;
    slug: string;
    title: string;
    order: number;
  };
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      video: lesson.video,
      content: lesson.content,
      slug: lesson.slug,
      title: lesson.title,
      order: lesson.order,
    },
  });
  async function onSubmitLesson(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await updateLesson({
        lessonId,
        path: `/admin/course/content?slug=${slug}`,
        data: {
          ...values,
          slug:
            values.slug ||
            slugify(lesson.title, {
              lower: true,
              locale: "vi",
              remove: /[*+~.()'"!:@]/g,
            }),
        },
      });
      if (res?.type === "error" && res?.message) {
        toast.error(res.message);
        return;
      }
      toast.success("Bài học đã được cập nhật thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitLesson)}
        className="flex flex-col gap-6"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="Slug"
                  className="bgDarkestMode"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đường dẫn video</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập đường dẫn video"
                  className="bgDarkestMode"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung"
                  className="bgDarkestMode"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thứ tự</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập thứ tự"
                  className="bgDarkestMode w-20"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-3">
          <Button
            className={cn(primaryButtonClassName)}
            type="submit"
            isLoading={isSubmitting}
          >
            Cập nhật
          </Button>
          <Link
            href={`/lesson?slug=${lesson.slug}`}
            target="_blank"
            className={cn(
              baseButtonClassName,
              "hover:bg-gray-100 dark:hover:bg-grayDarkest"
            )}
          >
            Xem trước
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default CourseContentLesson;
