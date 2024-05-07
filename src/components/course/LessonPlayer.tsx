"use client";
import { baseButtonClassName } from "@/constants";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import { formUrlQuery } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
const LessonPlayer = ({
  lessonDetails,
  videoId = "",
  video = "",
  nextLesson,
  prevLesson,
}: {
  video: string;
  lessonDetails: {
    title: string;
    content: string;
  };
  videoId: string;
  nextLesson?: string;
  prevLesson?: string;
}) => {
  const handle = useFullScreenHandle();
  const { isFullscreen, toggleFullscreen } = useGlobalStore();

  return (
    <div>
      <FullScreen handle={handle}>
        <div className="relative group">
          {video.includes("iframe") ? (
            <div
              dangerouslySetInnerHTML={{
                __html: video,
              }}
              className="w-full h-full object-cover rounded-lg aspect-video mb-5 [&_iframe]:w-full [&_iframe]:h-full"
            ></div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full object-cover rounded-lg aspect-video mb-5"
            ></iframe>
          )}

          <PlayerControl action="prev" url={prevLesson}></PlayerControl>
          <PlayerControl action="next" url={nextLesson}></PlayerControl>
        </div>
      </FullScreen>

      <button
        onClick={() => {
          toggleFullscreen(true);
          handle.enter();
        }}
        className={cn(
          baseButtonClassName,
          "mb-5 ml-auto flex w-fit gap-2 bg-white dark:bg-grayDarker"
        )}
      >
        <IconFullscreen />
        Toàn màn hình
      </button>
      <h1 className="font-bold text-2xl mb-5">{lessonDetails.title}</h1>
      <div className="lesson-content">{lessonDetails.content}</div>
    </div>
  );
};
function PlayerControl({
  url = "",
  action,
}: {
  url?: string;
  action: "prev" | "next";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleChangeLesson = (url: string) => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "slug",
      value: url,
    });
    router.push(newUrl);
  };
  if (!url) return null;
  return (
    <button
      onClick={() => handleChangeLesson(url)}
      className={cn(
        "flex size-10 rounded items-center bg-white justify-center absolute top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all dark:bg-grayDarker",
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
