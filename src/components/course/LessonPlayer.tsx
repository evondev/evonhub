"use client";
import { baseButtonClassName } from "@/constants";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import { formUrlQuery } from "@/utils";
import MuxPlayer from "@mux/mux-player-react";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const LessonPlayer = ({
  lessonDetails,
  videoId = "",
  nextLesson,
  prevLesson,
}: {
  lessonDetails: {
    title: string;
    content: string;
    slug: string;
    course: string;
  };
  videoId: string;
  nextLesson?: string;
  prevLesson?: string;
}) => {
  const handle = useFullScreenHandle();
  const { toggleExpanded, isExpanded } = useGlobalStore();
  const handleExpandScreen = () => {
    toggleExpanded?.(!isExpanded);
  };
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handleChangeLesson = (url: string) => {
    if (!url) return;
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "slug",
      value: url,
    });
    router.push(newUrl);
  };
  useEffect(() => {
    const links = document.querySelectorAll(".lesson-content a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
    });
  }, [lessonDetails.content]);
  const videoRef = useRef<any>(null);
  useEffect(() => {
    if (!videoId) return;
    // save last course lesson slug and course to local storage
    const localData =
      JSON.parse(localStorage.getItem("lastCourseLesson") || "[]") || [];
    if (!Array.isArray(localData)) return;
    const existLesson = localData.find(
      (item: { course: string; lesson: string }) =>
        item.course === lessonDetails.course
    );
    if (existLesson) {
      const index = localData.findIndex(
        (item: { course: string; lesson: string }) =>
          item.course === lessonDetails.course
      );
      localData.splice(index, 1);
    }

    const item = {
      course: lessonDetails.course,
      lesson: lessonDetails.slug,
    };
    const data = localData.concat(item);
    localStorage.setItem("lastCourseLesson", JSON.stringify(data));
  }, [lessonDetails.course, lessonDetails.slug, videoId]);
  useEffect(() => {
    const storageKey = `videoTime-${lessonDetails.slug}`;
    const video = videoRef.current;
    const savedTime = localStorage.getItem(storageKey);

    if (savedTime && video) {
      video.currentTime = parseFloat(savedTime);
    }

    const handleTimeUpdate = debounce(() => {
      if (video) {
        localStorage.setItem(storageKey, video.currentTime);
      }
    }, 5000);

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [lessonDetails.slug, videoId]);

  return (
    <div className="lg:mb-8">
      <FullScreen handle={handle}>
        <div className="relative group aspect-video lg:mb-5">
          {videoId ? (
            <MuxPlayer
              streamType="on-demand"
              playbackId={videoId}
              onEnded={() => {
                handleChangeLesson(nextLesson || "");
              }}
              className="w-full h-full inline-block align-bottom"
              ref={videoRef}
              autoPlay
            />
          ) : (
            <div className="w-full h-full bg-white dark:bg-grayDarker rounded-lg"></div>
          )}

          {prevLesson && (
            <PlayerControl
              action="prev"
              onClick={() => handleChangeLesson(prevLesson)}
            ></PlayerControl>
          )}
          {nextLesson && (
            <PlayerControl
              action="next"
              onClick={() => handleChangeLesson(nextLesson)}
            ></PlayerControl>
          )}
        </div>
      </FullScreen>

      <div className="hidden lg:flex items-center justify-end mb-5 gap-3">
        <button
          onClick={handleExpandScreen}
          className={cn(
            baseButtonClassName,
            "flex w-fit gap-2 bgDarkMode borderDarkMode"
          )}
        >
          {isExpanded ? "Mặc định" : "Mở rộng"}
        </button>
        <button
          onClick={() => {
            handle.enter();
          }}
          className={cn(
            baseButtonClassName,
            "flex w-fit gap-2 bgDarkMode borderDarkMode"
          )}
        >
          <IconFullscreen />
          Toàn màn hình
        </button>
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
};
function PlayerControl({
  onClick,
  action,
}: {
  onClick: () => void;
  action: "prev" | "next";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex opacity-0 invisible group-hover:opacity-100 group-hover:visible size-10 rounded items-center bg-white justify-center absolute top-1/2 -translate-y-1/2 z-10 hover:!bg-primary hover:!text-white transition-all dark:bg-grayDarker",
        action === "prev" ? "left-5" : "right-5"
      )}
    >
      {action === "next" ? <IconLongArrowRight /> : <IconLongArrowLeft />}
    </button>
  );
}
function IconLongArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
      />
    </svg>
  );
}
function IconLongArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
}
function IconFullscreen() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  );
}
export default LessonPlayer;
