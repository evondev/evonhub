"use client";

import ButtonGradient from "@/components/button/ButtonGradient";
import { Heading, IconStar } from "@/shared/components";
import MuxPlayer from "@mux/mux-player-react";
import { useQueryVideoBySlug } from "../services";

export interface StudyVideoPageProps {
  slug: string;
}

export function StudyVideoPage({ slug }: StudyVideoPageProps) {
  const { data } = useQueryVideoBySlug({ slug });
  const video = data?.video || "";
  const iframeId = video.includes("youtube") ? video.split("watch?v=")[1] : "";

  // if (data?.status !== MicroStatus.Approved) {
  //   return (
  //     <>
  //       <div className="flex flex-col gap-10 max-w-7xl mx-auto lg:py-10">
  //         <Heading>{data?.title}</Heading>
  //         <div className="bgDarkMode p-5 rounded-md">
  //           Nội dung đang được tác giả cập nhật, vui lòng quay lại sau nhé!
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto lg:py-10">
      <Heading>{data?.title}</Heading>
      {iframeId && (
        <div className="lg:border borderDarkMode lg:rounded-xl bgDarkMode overflow-hidden aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${iframeId}`}
            title={data?.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="size-full object-fill"
          ></iframe>
        </div>
      )}
      {video && !iframeId && (
        <div className="relative aspect-video">
          <MuxPlayer
            streamType="on-demand"
            playbackId={video}
            className="w-full h-full inline-block align-bottom"
            autoPlay
          />
        </div>
      )}
      <ButtonGradient
        className={{
          wrapper: "rounded-full",
          main: "flex items-center gap-2 px-3 text-sm",
        }}
      >
        <IconStar className="size-4 group-hover:animate-spin fill-[#ff979a]" />
        Đánh giá khóa học
      </ButtonGradient>
      <div
        className="bgDarkMode p-5 rounded-md lesson-content"
        dangerouslySetInnerHTML={{ __html: data?.content || "" }}
      ></div>
    </div>
  );
}
