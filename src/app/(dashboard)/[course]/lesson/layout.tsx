import LessonDesktopAside from "@/components/lesson/LessonDesktopAside";
import LessonLayout from "@/components/lesson/LessonLayout";
import LessonToggle from "@/components/lesson/LessonToggle";
import LessonContentSkeleton from "@/components/loading/LessonContentSkeleton";
import PlayerLoadingSkeleton from "@/components/loading/PlayerLoadingSkeleton";
import { getCourseBySlug } from "@/lib/actions/course.action";
import React, { Suspense } from "react";
export const maxDuration = 60;

const layout = async ({
  player,
  content,
  params,
  comment,
}: {
  player: React.ReactNode;
  content: React.ReactNode;
  comment: React.ReactNode;
  params: {
    course: string;
  };
}) => {
  const foundCourse = await getCourseBySlug(params.course);
  if (!foundCourse) return null;

  const courseId = foundCourse?._id.toString();

  return (
    <LessonLayout courseId={courseId}>
      <div className="lg:overflow-hidden lg:p-2 flex-shrink-0 w-full">
        <Suspense fallback={<PlayerLoadingSkeleton />}>{player}</Suspense>
        {comment}
      </div>
      <Suspense fallback={<LessonContentSkeleton />}>
        <LessonToggle></LessonToggle>
        <LessonDesktopAside>{content}</LessonDesktopAside>
      </Suspense>
    </LessonLayout>
  );
};

export default layout;
