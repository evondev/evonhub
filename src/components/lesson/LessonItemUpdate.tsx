import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  baseButtonClassName,
  editorOptions,
  primaryButtonClassName,
} from "@/constants";
import { updateLesson } from "@/lib/actions/lesson.action";
import { cn } from "@/lib/utils";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { z } from "zod";

const formSchema = z.object({
  video: z.string().optional(),
  content: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  duration: z.number().optional(),
});

const LessonItemUpdate = ({
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
    duration: number;
  };
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      video: lesson.video,
      content: lesson.content,
      slug: lesson.slug,
      title: lesson.title,
      duration: lesson.duration,
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
              <FormLabel>Đường dẫn bài học</FormLabel>
              <FormControl>
                <Input
                  placeholder="Đường dẫn bài học"
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
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập Video URL"
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
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  // @ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  {...editorOptions(field, theme)}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian (phút)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Số (phút)"
                  className="bgDarkestMode w-24"
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

export default LessonItemUpdate;
