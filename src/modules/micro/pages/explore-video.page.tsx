"use client";

import { Heading } from "@/shared/components";
import VideoItem from "../components/video-item";
import { useQueryVideos } from "../services";

export interface ExploreVideoPageProps {}

export function ExploreVideoPage(_props: ExploreVideoPageProps) {
  const { data } = useQueryVideos({});
  return (
    <div className="flex flex-col gap-10">
      <Heading>Học qua Videos ngắn</Heading>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {data?.map((item) => (
          <VideoItem key={item.slug} data={item} />
        ))}
      </div>
    </div>
  );
}
