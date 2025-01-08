"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonOutlineItem } from "@/modules/lesson/components";
import { useQueryLessonDetailsOutline } from "@/modules/lesson/services";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { LoadingOutline } from "./loading-outline";

export interface LessonOutlineProps {}

export function LessonOutline(_props: LessonOutlineProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: lectures, isLoading } = useQueryLessonDetailsOutline({
    slug: params.course.toString(),
  });

  const lessonId = searchParams.get("id")?.toString() || "";

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
    const element = document.getElementById(lessonId);
    function handleClickOutside(event: MouseEvent | TouchEvent) {
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
    document.addEventListener("touchend", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [lessonId]);

  if (isLoading) return <LoadingOutline />;
  if (lectures?.length === 0 || !lectures) return null;

  return (
    <div className="flex-1 h-full lg:h-auto w-full static lg:sticky top-10 xl:top-[112px] right-0 p-3 lg:p-0 h-[calc(100%-56px)] w-full lg:p-0 lg:h-auto overflow-y-auto lg:overflow-y-visible">
      <div
        className="lg:max-h-[calc(100vh-175px-56px)] xl:max-h-[calc(100vh-175px)] lg:overflow-y-auto scroll-hidden rounded-lg"
        ref={containerRef}
        onMouseLeave={handleLeaveContainer}
        onTouchEnd={handleLeaveContainer}
      >
        {lectures.map((item) => {
          const activeLesson = item.lessons.find(
            (el) => el._id.toString() === lessonId
          );

          return (
            <Accordion
              type="single"
              collapsible
              className="w-full mb-3 lg:mb-5"
              key={item.title}
              defaultValue={activeLesson?.lectureId?.title || ""}
            >
              <AccordionItem value={item.title || ""}>
                <AccordionTrigger className="font-bold dark:text-text5 text-sm lg:text-base">
                  <div className="line-clamp-1 text-left">{item.title}</div>
                </AccordionTrigger>
                <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-3 lg:mt-5">
                  {item.lessons.map((lesson) => {
                    return (
                      <LessonOutlineItem
                        key={lesson._id}
                        title={lesson.title}
                        id={lesson._id}
                        isActive={lesson._id.toString() === lessonId}
                        duration={lesson.duration}
                      ></LessonOutlineItem>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}