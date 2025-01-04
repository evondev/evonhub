"use client";

import EmptyData from "@/components/EmptyData";
import { useQueryLessonById } from "@/modules/lesson/services";
import { useQueryLessonsByCourseId } from "@/modules/lesson/services/data/query-lessons-by-course-id.data";
import { IconFullScreen } from "@/shared/components";
import { cn, extractDriveId } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import MuxPlayer from "@mux/mux-player-react";
import { useParams, useRouter } from "next/navigation";
import Prism from "prismjs";
import { useEffect, useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Loading } from "./loading";
import { PlayerNavigation } from "./player-navigation";

export interface LessonContentProps {}

export function LessonContent(_props: LessonContentProps) {
  const handle = useFullScreenHandle();
  const { toggleExpanded, isExpanded } = useGlobalStore();
  const handleExpandScreen = () => {
    toggleExpanded?.(!isExpanded);
  };
  const params = useParams();
  const router = useRouter();
  const videoRef = useRef<any>(null);

  const { data: lessonDetails, isFetching } = useQueryLessonById({
    lessonId: params.id.toString(),
  });
  const courseDetails = lessonDetails?.courseId;
  const { data: lessonList } = useQueryLessonsByCourseId({
    courseId: courseDetails?._id?.toString() || "",
  });

  const lessonIndex =
    lessonList?.findIndex(
      (lesson) => lesson._id.toString() === params.id.toString()
    ) || -1;
  const nextLesson = lessonList?.[lessonIndex + 1]?._id;
  const prevLesson = lessonList?.[lessonIndex - 1]?._id;
  const iframeId = extractDriveId(lessonDetails?.iframe || "");
  const videoId = lessonDetails?.video || "";

  useEffect(() => {
    const links = document.querySelectorAll(".lesson-content a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
    });
  }, [lessonDetails?.content]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    Prism.highlightAll();
  }, [lessonDetails?.content.length]);

  useEffect(() => {
    if (!lessonDetails) return;
    if (typeof localStorage === "undefined") return;
    const localData =
      JSON.parse(localStorage.getItem("lastCourseLesson") || "[]") || [];
    if (!Array.isArray(localData)) return;
    const existLesson = localData.find(
      (item: { course: string; lesson: string }) =>
        item.course === courseDetails?.slug
    );
    if (existLesson) {
      const index = localData.findIndex(
        (item: { course: string; lesson: string }) =>
          item.course === courseDetails?.slug
      );
      localData.splice(index, 1);
    }

    const item = {
      course: courseDetails?.slug,
      lesson: lessonDetails._id,
    };
    const data = localData.concat(item);
    localStorage.setItem("lastCourseLesson", JSON.stringify(data));
  }, [courseDetails?.slug, lessonDetails]);

  if (isFetching) return <Loading />;
  if (!lessonDetails) return <EmptyData text="Bài học không tồn tại!" />;

  return (
    <div className="lg:mb-8">
      <FullScreen handle={handle}>
        <div className="relative group aspect-video lg:mb-5">
          {videoId ? (
            <div className="relative">
              <div
                className={cn("player-bar h-1 absolute top-0 left-0 z-10 w-0")}
              ></div>
              <MuxPlayer
                streamType="on-demand"
                playbackId={videoId}
                className="w-full h-full inline-block align-bottom"
                ref={videoRef}
                autoPlay
                minResolution="480p"
              />
            </div>
          ) : iframeId ? (
            <div className="size-full lg:border borderDarkMode lg:rounded-lg bgDarkMode overflow-hidden">
              <iframe
                src={`https://drive.google.com/file/d/${iframeId}/preview`}
                className="size-full object-fill"
                allow="autoplay"
              ></iframe>
            </div>
          ) : (
            <div className="w-full h-full lg:border borderDarkMode lg:rounded-lg bgDarkMode"></div>
          )}
          <div className="hidden lg:block">
            {prevLesson && (
              <PlayerNavigation
                action="prev"
                lessonId={prevLesson}
              ></PlayerNavigation>
            )}
            {nextLesson && (
              <PlayerNavigation
                action="next"
                lessonId={nextLesson}
              ></PlayerNavigation>
            )}
          </div>
        </div>
      </FullScreen>
      <div className="flex items-center justify-end gap-2 p-2">
        {prevLesson && (
          <PlayerNavigation
            action="prev"
            lessonId={prevLesson}
          ></PlayerNavigation>
        )}
        {nextLesson && (
          <PlayerNavigation
            action="next"
            lessonId={nextLesson}
          ></PlayerNavigation>
        )}
      </div>

      <div className="hidden lg:flex items-center justify-end mb-5 gap-3">
        <button
          onClick={handleExpandScreen}
          className={
            "rounded-lg h-12 inline-flex items-center justify-center text-center px-5 font-bold min-w-[120px] transition-all text-sm flex-shrink-0 flex w-fit gap-2 bgDarkMode borderDarkMode"
          }
        >
          {isExpanded ? "Mặc định" : "Mở rộng"}
        </button>
        <button
          onClick={() => {
            handle.enter();
          }}
          className={
            "rounded-lg h-12 inline-flex items-center justify-center text-center px-5 font-bold min-w-[120px] transition-all text-sm flex-shrink-0 flex w-fit gap-2 bgDarkMode borderDarkMode"
          }
        >
          <IconFullScreen />
          Toàn màn hình
        </button>
        {/* <RatingForm courseId={lessonDetails.courseId}></RatingForm> */}
      </div>
      <div className="p-3 lg:p-0">
        <h1 className="font-extrabold text-xl lg:text-2xl lg:mb-10">
          {lessonDetails.title}
        </h1>
      </div>

      {lessonDetails.content && (
        <div className="lesson-content hidden lg:block  p-5 rounded-lg bgDarkMode borderDarkMode text-sm">
          <div
            dangerouslySetInnerHTML={{ __html: lessonDetails.content }}
          ></div>
        </div>
      )}
    </div>
  );
}
