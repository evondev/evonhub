"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateLesson } from "@/modules/lesson/actions";
import type { LessonModelProps } from "@/shared/types";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import type { ContentLesson, LessonEditorValues } from "../types";
import { buildCourseContentPath } from "../utils";
import { LessonContentSection } from "./lesson-content-section";
import { LessonEditorHeader } from "./lesson-editor-header";
import { LessonInfoSection } from "./lesson-info-section";
import { LessonVideoSection } from "./lesson-video-section";

export interface LessonEditorProps {
  lesson: ContentLesson;
  lectureTitle: string;
  lessonPosition: number;
  lessonCount: number;
  course: {
    id: string;
    slug: string;
  };
  onDelete: (lesson: ContentLesson) => void;
  onDirtyChange: (isDirty: boolean) => void;
}

function buildLessonSlug(values: LessonEditorValues) {
  if (values.slug.trim()) return values.slug.trim();

  return slugify(values.title, {
    lower: true,
    locale: "vi",
    remove: /[*+~.()'"!:@,?_]/g,
  });
}

export function LessonEditor({
  lesson,
  lectureTitle,
  lessonPosition,
  lessonCount,
  course,
  onDelete,
  onDirtyChange,
}: LessonEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LessonEditorValues>({
    defaultValues: {
      title: lesson.title,
      slug: lesson.slug,
      duration: lesson.duration,
      video: lesson.video,
      assetId: lesson.assetId || "",
      iframe: lesson.iframe || "",
      content: lesson.content,
      trial: !!lesson.trial,
    },
  });
  const { isDirty } = form.formState;

  // Trang cần biết form có thay đổi chưa lưu để hỏi trước khi chuyển sang bài khác
  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  async function handleSubmit(values: LessonEditorValues) {
    setIsSubmitting(true);
    const savedValues: LessonEditorValues = {
      ...values,
      title: values.title.trim(),
      duration: Number(values.duration) || 0,
      trial: !!values.trial,
      slug: buildLessonSlug(values),
    };

    try {
      const response = await updateLesson({
        lessonId: lesson._id,
        path: buildCourseContentPath(course.slug),
        data: {
          ...savedValues,
          // Model khai courseId là ObjectId, server action nhận chuỗi id như bản cũ
          courseId: course.id as unknown as LessonModelProps["courseId"],
        },
      });

      if (response?.type === "error" && response?.message) {
        toast.error(response.message);
        return;
      }

      // Giá trị vừa lưu thành mốc mới: form hết "chưa lưu", ô đường dẫn hiện slug vừa tạo
      form.reset(savedValues);
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
        onSubmit={form.handleSubmit(handleSubmit)}
        autoComplete="off"
        className="flex min-w-0 flex-col gap-6"
      >
        <LessonEditorHeader
          lectureTitle={lectureTitle}
          lessonPosition={lessonPosition}
          lessonCount={lessonCount}
          previewHref={`/${course.slug}/lesson?id=${lesson._id}`}
          isSubmitting={isSubmitting}
        />
        <LessonInfoSection />
        <LessonVideoSection />
        <LessonContentSection />

        <div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(lesson)}
          >
            <Trash2 className="size-4 shrink-0" aria-hidden />
            Xoá bài học
          </Button>
        </div>
      </form>
    </Form>
  );
}
