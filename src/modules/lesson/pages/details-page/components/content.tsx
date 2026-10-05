"use client";

import { useUserContext } from "@/components/user-context";
import { useCourseProgress } from "@/modules/lesson/hooks";
import {
  useQueryLessonDetailsOutline,
  useQueryLessonsByCourseId,
} from "@/modules/lesson/services";
import Fireworks from "@/shared/components/common/fireworks";
import { useMutationCompleteLesson } from "@/shared/data";
import { LessonItemCutomizeData } from "@/shared/types";
import { cn, extractDriveId } from "@/shared/utils";
import { useEffect } from "react";
import { LessonBar } from "./lesson-bar";
import { LessonTabs } from "./lesson-tabs";
import { LessonVideo } from "./lesson-video";

export interface LessonContentProps {
  lessonId: string;
  lessonDetails: LessonItemCutomizeData;
  canAccessContent?: boolean;
}

interface LastCourseLesson {
  course: string;
  lesson: string;
}

export function LessonContent({
  lessonId,
  lessonDetails,
  canAccessContent = false,
}: LessonContentProps) {
  const mutateCompleteLesson = useMutationCompleteLesson();
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";

  const courseDetails = lessonDetails?.courseId;
  const courseId = courseDetails?._id?.toString() || "";
  const courseSlug = courseDetails?.slug || "";

  const { data: lessonList } = useQueryLessonsByCourseId({
    courseId,
    enabled: !!canAccessContent,
  });
  const { data: lectures } = useQueryLessonDetailsOutline({ slug: courseSlug });
  const { percent } = useCourseProgress(courseSlug);

  const lessonIndex =
    lessonList?.findIndex((lesson) => lesson._id.toString() === lessonId) || 0;
  const nextLessonId = lessonList?.[lessonIndex + 1]?._id?.toString();
  const prevLessonId = lessonList?.[lessonIndex - 1]?._id?.toString();
  const chapterTitle = lectures?.find((lecture) =>
    lecture.lessons.some((lesson) => lesson._id.toString() === lessonId),
  )?.title;

  const iframeId = extractDriveId(lessonDetails?.iframe || "");
  const videoId = lessonDetails?.video || "";
  const hasVideo = !!(videoId || iframeId);

  const handleVideoNearEnd = async () => {
    await mutateCompleteLesson.mutateAsync({
      lessonId,
      userId,
      courseId,
      isSingleton: true,
    });
  };

  // Ghi bài đang học dở của từng khóa để nút "Học tiếp" mở đúng bài
  useEffect(() => {
    if (!lessonDetails || typeof localStorage === "undefined") return;

    const storedLessons: LastCourseLesson[] =
      JSON.parse(localStorage.getItem("lastCourseLesson") || "[]") || [];
    if (!Array.isArray(storedLessons)) return;

    const otherCourses = storedLessons.filter(
      (item) => item.course !== courseSlug,
    );
    const currentCourse = { course: courseSlug, lesson: lessonDetails._id };

    localStorage.setItem(
      "lastCourseLesson",
      JSON.stringify([...otherCourses, currentCourse]),
    );
  }, [courseSlug, lessonDetails]);

  return (
    <div className="min-w-0">
      {hasVideo && (
        <LessonVideo
          videoId={videoId}
          iframeId={iframeId || ""}
          onNearEnd={handleVideoNearEnd}
        />
      )}

      <div className={cn(hasVideo && "mt-4 lg:mt-5", !hasVideo && "pt-4 lg:pt-0")}>
        <LessonBar
          title={lessonDetails.title}
          chapterTitle={chapterTitle}
          duration={lessonDetails.duration}
          prevLessonId={canAccessContent ? prevLessonId : undefined}
          nextLessonId={canAccessContent ? nextLessonId : undefined}
        />
      </div>

      {canAccessContent && (
        <div className="mt-5 lg:mt-6">
          <LessonTabs lessonId={lessonId} notesHtml={lessonDetails.content} />
        </div>
      )}

      {percent === 100 && <Fireworks className="fixed" />}
    </div>
  );
}
