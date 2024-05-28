"use client";
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
import { editorOptions } from "@/constants";
import { updateLesson } from "@/lib/actions/lesson.action";
import { cn } from "@/lib/utils";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  assetId: z.string().optional(),
});
const btnClassName =
  "text-xs py-2 px-3 h-10 rounded-md font-semibold w-[100px] flex items-center justify-center";
const LessonItemUpdate = ({
  lessonId,
  slug,
  lesson,
  course,
}: {
  lessonId: string;
  slug: string;
  lesson: {
    video: string;
    content: string;
    slug: string;
    title: string;
    duration: number;
    assetId?: string;
  };
  course: {
    id: string;
    slug: string;
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
      assetId: lesson.assetId,
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
          courseId: course.id as any,
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
  useEffect(() => {
    const timer = setTimeout(() => {
      const editor = editorRef.current as any;
      if (editor) {
        editor.setContent(lesson.content);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [lesson.content]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitLesson)}
        className="flex flex-col gap-6"
        autoComplete="off"
      >
        <div className="grid grid-cols-[minmax(0,1fr),49%] gap-5">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đường dẫn bài học</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Đường dẫn bài học"
                    className=""
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel>Thời gian (phút)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Số (phút)"
                    className=" w-24"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Id</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className=""
                    placeholder="Video Id"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Id</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Asset Id" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
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
                  value={field.value}
                  {...editorOptions(field, theme)}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3">
          <Button
            className={cn(btnClassName, " bg-primary text-white button-styles")}
            type="submit"
            isLoading={isSubmitting}
          >
            Cập nhật
          </Button>
          <Link
            href={`/${course.slug}/lesson?slug=${lesson.slug}`}
            target="_blank"
            className={cn(btnClassName)}
          >
            Xem trước
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LessonItemUpdate;
