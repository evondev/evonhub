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
import { cn } from "@/lib/utils";
import { updateLesson } from "@/modules/lesson/actions";
import { UpdateLessonValues } from "@/shared/form-schemas";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { IconEdit } from "../icons";
import { Switch } from "../ui/switch";

interface LessonItemUpdateProps {
  lessonId: string;
  slug: string;
  lesson: {
    video: string;
    content: string;
    slug: string;
    title: string;
    duration: number;
    assetId?: string;
    iframe?: string;
  };
  course: {
    id: string;
    slug: string;
    lectures: any[];
  };
}

const LessonItemUpdate = ({
  lessonId,
  slug,
  lesson,
  course,
}: LessonItemUpdateProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const form = useForm<UpdateLessonValues>({
    defaultValues: {
      video: lesson.video,
      content: lesson.content,
      slug: lesson.slug,
      title: lesson.title,
      duration: lesson.duration,
      assetId: lesson.assetId,
      iframe: lesson.iframe,
    },
  });

  async function onSubmitLesson(values: UpdateLessonValues) {
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
              remove: /[*+~.()'"!:@,?_]/g,
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
                <FormLabel>Playback ID</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className=""
                    placeholder="Playback ID"
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
                <FormLabel>Asset ID</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Asset ID" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="iframe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Iframe</FormLabel>
              <FormControl>
                <Input type="text" className="font-sans" {...field} />
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
                  // onInit={(evt, editor) => (editorRef.current = editor)}
                  onInit={(_evt, editor) => {
                    (editorRef.current = editor).setContent(
                      lesson.content || ""
                    );
                  }}
                  value={field.value}
                  {...editorOptions(field, theme, 300)}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="trial"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Trial</FormLabel>
                <FormControl>
                  <Switch
                    className="!mt-0"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-1">
            <Button
              className={cn(
                "text-sm py-2 px-5 h-12 rounded-md font-semibold w-[125px] flex items-center justify-center",
                "rounded-full border border-current gap-1 hover:bg-gray-50 dark:hover:bg-grayDarkest dark:border-opacity-10 dark:border-gray-200"
              )}
              type="submit"
              isLoading={isSubmitting}
            >
              <IconEdit />
              <span>Cập nhật</span>
            </Button>
            <Link
              href={`/${course.slug}/lesson?id=${lessonId}`}
              target="_blank"
              className="text-sm py-2 px-5 h-12 rounded-md font-semibold w-[125px] flex items-center justify-center"
            >
              Xem trước
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LessonItemUpdate;
