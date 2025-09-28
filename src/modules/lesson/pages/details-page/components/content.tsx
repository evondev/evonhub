"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryLessonsByCourseId } from "@/modules/lesson/services/data/query-lessons-by-course-id.data";
import { IconFullScreen } from "@/shared/components";
import { useMutationCompleteLesson } from "@/shared/data";
import { RatingForm } from "@/shared/features/rating";
import { LessonItemCutomizeData } from "@/shared/types";
import { cn, extractDriveId } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import MuxPlayer from "@mux/mux-player-react";
import Image from "next/image";
import Prism from "prismjs";
import { useEffect, useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { PlayerNavigation } from "./player-navigation";

export interface LessonContentProps {
  lessonId: string;
  lessonDetails: LessonItemCutomizeData;
  canAccessContent?: boolean;
}

export function LessonContent({
  lessonId,
  lessonDetails,
  canAccessContent = false,
}: LessonContentProps) {
  const handle = useFullScreenHandle();
  const { toggleExpanded, isExpanded } = useGlobalStore();
  const mutateCompleteLesson = useMutationCompleteLesson();
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";

  const videoRef = useRef<any>(null);
  const courseDetails = lessonDetails?.courseId;

  const { data: lessonList } = useQueryLessonsByCourseId({
    courseId: courseDetails?._id?.toString() || "",
    enabled: !!canAccessContent,
  });

  const lessonIndex =
    lessonList?.findIndex((lesson) => lesson._id.toString() === lessonId) || 0;
  const nextLesson = lessonList?.[lessonIndex + 1]?._id;
  const prevLesson = lessonList?.[lessonIndex - 1]?._id;
  const iframeId = extractDriveId(lessonDetails?.iframe || "");
  const videoId = lessonDetails?.video || "";
  const hasVideo = videoId || iframeId;

  const handleVideoTimeUpdate = async () => {
    const isVideoEnded =
      videoRef.current?.duration - videoRef.current?.currentTime <= 10;
    if (!isVideoEnded) return;
    await mutateCompleteLesson.mutateAsync({
      lessonId,
      userId,
      courseId: courseDetails?._id?.toString() || "",
      isSingleton: true,
    });
  };

  const handleExpandScreen = () => {
    toggleExpanded?.(!isExpanded);
  };

  useEffect(() => {
    const links = document.querySelectorAll(".lesson-content a");

    links.forEach((link) => {
      link.setAttribute("target", "_blank");
    });
  }, [lessonDetails?.content]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTimeout(() => {
      Prism.highlightAll();
    }, 2000);
  }, [lessonDetails, canAccessContent]);

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

  return (
    <div>
      {hasVideo && (
        <div className=" lg:relative lg:h-full lg:overflow-hidden lg:max-h-[80vh] lg:min-h-[400px] lg:mb-8">
          <FullScreen handle={handle}>
            <div className="relative group aspect-video lg:aspect-auto lg:pt-[65%] lg:overflow-hidden lg:static lg:mb-5">
              {videoId ? (
                <div className="size-full lg:border borderDarkMode lg:rounded-lg bgDarkMode overflow-hidden lg:absolute lg:left-0 lg:top-0">
                  <div
                    className={cn(
                      "player-bar h-1 absolute top-0 left-0 z-10 w-0"
                    )}
                  ></div>
                  <MuxPlayer
                    streamType="on-demand"
                    playbackId={videoId}
                    className="w-full h-full inline-block align-bottom"
                    ref={videoRef}
                    autoPlay
                    minResolution="1080p"
                    onTimeUpdate={handleVideoTimeUpdate}
                  />
                </div>
              ) : iframeId ? (
                <div className="size-full lg:border borderDarkMode lg:rounded-lg bgDarkMode overflow-hidden lg:absolute lg:left-0 lg:top-0">
                  <iframe
                    src={`https://drive.google.com/file/d/${iframeId}/preview`}
                    className="size-full object-fill"
                    allow="autoplay"
                  ></iframe>
                </div>
              ) : (
                <div className="w-full h-full lg:border borderDarkMode lg:rounded-lg bgDarkMode"></div>
              )}
              {canAccessContent && (
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
              )}
            </div>
          </FullScreen>
        </div>
      )}
      {canAccessContent && (
        <div className="flex lg:hidden items-center justify-end gap-2 px-2 py-6">
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
      )}

      {hasVideo && (
        <div className="hidden lg:flex items-center justify-end mb-5 gap-3">
          <div className="mr-auto hidden xl:flex items-center gap-1 [&>*]:size-10 ">
            <Image width={80} height={80} src="/reactions/like.png" alt="" />
            <Image width={80} height={80} src="/reactions/haha.png" alt="" />
            <Image width={80} height={80} src="/reactions/love.png" alt="" />
            <Image width={80} height={80} src="/reactions/sad.png" alt="" />
            <Image width={80} height={80} src="/reactions/wow.png" alt="" />
            <Image width={80} height={80} src="/reactions/angry.png" alt="" />
          </div>
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

          {canAccessContent && (
            <RatingForm courseId={lessonDetails.courseId?._id}></RatingForm>
          )}
        </div>
      )}
      <div className="p-3">
        <h1 className="font-extrabold text-xl lg:text-2xl xl:text-3xl lg:mb-10">
          {lessonDetails.title}
        </h1>
      </div>
      {!hasVideo && (
        <div className="mb-10">
          <RatingForm courseId={lessonDetails.courseId?._id}></RatingForm>
        </div>
      )}

      {lessonDetails.content && canAccessContent && (
        <div className="lesson-content hidden lg:block overflow-hidden break-text  p-5 rounded-lg bgDarkMode borderDarkMode text-sm !leading-loose">
          <div
            dangerouslySetInnerHTML={{ __html: lessonDetails.content }}
          ></div>
        </div>
      )}
    </div>
  );
}
