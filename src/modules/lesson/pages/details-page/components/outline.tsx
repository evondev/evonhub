"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryCourseBySlug } from "@/modules/course/services";
import { useQueryHistoriesByUser } from "@/modules/history/services";
import {
  useQueryLessonDetailsOutline,
  useQueryLessonsByCourseId,
} from "@/modules/lesson/services";
import { ProgressBar } from "@/shared/components/common";
import Fireworks from "@/shared/components/common/fireworks";
import { CourseOutline } from "@/shared/components/course";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { LoadingOutline } from "./loading-outline";

export interface LessonOutlineProps {
  lessonId: string;
}

export function LessonOutline({ lessonId }: LessonOutlineProps) {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";

  const { data: lectures, isLoading } = useQueryLessonDetailsOutline({
    slug: params.course.toString(),
  });

  const { data: courseDetails } = useQueryCourseBySlug({
    courseSlug: params.course.toString(),
  });

  const courseId = courseDetails?._id?.toString() || "";
  const { data: lessonList } = useQueryLessonsByCourseId({
    courseId,
    enabled: !!courseId,
  });

  const { data: histories } = useQueryHistoriesByUser({
    userId,
    courseId,
  });

  const progress = Math.floor(
    ((histories?.length ?? 0) / (lessonList?.length ?? 1)) * 100
  );

  const handleLeaveContainer = () => {
    const element = document.getElementById(lessonId);
    if (element && containerRef.current) {
      containerRef.current.scrollTo({
        top:
          element.offsetTop -
          containerRef.current.offsetTop -
          element.clientHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!lessonId || lectures?.length === 0) return;
    const timer = setTimeout(() => {
      handleLeaveContainer();
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lectures]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const element = document.getElementById(lessonId);
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        element
      ) {
        containerRef.current.scrollTo({
          top:
            element.offsetTop -
            containerRef.current.offsetTop -
            element.clientHeight,
          behavior: "smooth",
        });
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [lessonId]);

  if (isLoading) return <LoadingOutline />;
  if (lectures?.length === 0 || !lectures) return null;

  return (
    <>
      <div className="flex-1 h-full lg:h-auto w-full static lg:sticky top-10 xl:top-[112px] right-0 p-3 lg:p-0 h-[calc(100%-56px)] w-full lg:p-0 lg:h-auto overflow-y-auto lg:overflow-y-visible">
        <ProgressBar progress={progress} className="mb-5 dark:bg-grayDarker" />
        <div
          className="lg:max-h-[calc(100vh-175px-56px)] xl:max-h-[calc(100vh-175px)] lg:overflow-y-auto scroll-hidden rounded-xl"
          ref={containerRef}
        >
          <CourseOutline
            lectures={lectures}
            courseId={courseId}
            userId={userId}
            histories={histories}
            lessonId={lessonId}
          />
        </div>
      </div>
      {progress === 100 && <Fireworks className="fixed" />}
    </>
  );
}
