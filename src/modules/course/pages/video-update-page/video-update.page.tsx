"use client";

import { Form } from "@/components/ui/form";
import { updateCourse } from "@/lib/actions/course.action";
import { updateLesson } from "@/modules/lesson/actions";
import { updateVideoSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { VideoUpdateData, VideoUpdateFormValues } from "../../types";
import {
  buildVideoPublicHref,
  buildVideoUpdateHref,
} from "../../utils/course-manage.utils";
import { LessonContentSection } from "../content-page/components/lesson-content-section";
import { LessonVideoSection } from "../content-page/components/lesson-video-section";
import {
  CourseDescriptionSection,
  CourseMediaSection,
  CoursePricingSection,
  CoursePublishCard,
  CourseUpdateHeader,
} from "../update-page/components";
import { VideoBasicInfoSection } from "./components/video-basic-info-section";

export interface VideoUpdatePageProps {
  data: VideoUpdateData;
}

/**
 * Sửa video lẻ trên một trang: thông tin bán lưu vào course, video và nội dung
 * lưu vào bài học duy nhất của nó
 */
export function VideoUpdatePage({ data }: VideoUpdatePageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<VideoUpdateFormValues>({
    resolver: zodResolver(updateVideoSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      price: String(data.price || 0),
      salePrice: String(data.salePrice || 0),
      intro: data.intro || "",
      desc: data.desc || "",
      level: data.level,
      image: data.image,
      status: data.status,
      cta: data.cta,
      seoKeywords: data.seoKeywords || "",
      free: data.free,
      video: data.lesson.video || "",
      assetId: data.lesson.assetId || "",
      iframe: data.lesson.iframe || "",
      content: data.lesson.content || "",
      duration: data.lesson.duration || 0,
    },
  });

  async function handleSubmit(values: VideoUpdateFormValues) {
    setIsSubmitting(true);
    const savedSlug = values.slug?.trim() || data.slug;

    try {
      const courseResponse = await updateCourse({
        slug: savedSlug,
        courseSlug: data.slug,
        updateData: {
          title: values.title,
          slug: savedSlug,
          // Video miễn phí phải có giá 0, không thì isCourseFree vẫn coi là có phí
          price: values.free ? 0 : parseInt(values.price || "0"),
          salePrice: values.free ? 0 : parseInt(values.salePrice || "0"),
          intro: values.intro,
          image: values.image,
          desc: values.desc,
          level: values.level,
          status: values.status,
          cta: values.cta,
          seoKeywords: values.seoKeywords,
          free: values.free,
        },
        path: buildVideoUpdateHref(savedSlug),
      });

      if (courseResponse?.type === "error") {
        toast.error(courseResponse.message);
        return;
      }

      const lessonResponse = await updateLesson({
        lessonId: data.lesson._id,
        path: buildVideoUpdateHref(savedSlug),
        data: {
          title: values.title,
          slug: savedSlug,
          video: values.video.trim(),
          assetId: values.assetId.trim(),
          iframe: values.iframe.trim(),
          content: values.content,
          duration: values.duration,
        },
      });

      if (lessonResponse?.type === "error") {
        toast.error(lessonResponse.message);
        return;
      }

      toast.success("Đã lưu video");

      if (savedSlug !== data.slug) {
        router.replace(buildVideoUpdateHref(savedSlug));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6">
      <CourseUpdateHeader title={data.title} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          autoComplete="off"
          className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="flex min-w-0 flex-col gap-6">
            <VideoBasicInfoSection />
            <LessonVideoSection />
            <LessonContentSection />
            <CoursePricingSection
              freeLabel="Video miễn phí"
              freeDescription="Ai cũng xem được, không cần đăng nhập hay mua."
            />
            <CourseMediaSection />
            <CourseDescriptionSection description="Lời giới thiệu ngắn cho người chưa mua, hiện cạnh video giới thiệu." />
          </div>

          {/* Từ lg dính dưới header nổi (đáy 80px) để nút Lưu luôn trong tầm tay */}
          <aside className="lg:sticky lg:top-24">
            <CoursePublishCard
              previewHref={buildVideoPublicHref(data.slug)}
              isSubmitting={isSubmitting}
            />
          </aside>
        </form>
      </Form>
    </div>
  );
}
