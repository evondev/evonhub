"use client";

import VideoItem from "@/modules/micro/components/video-item";
import { useQueryVideosManage } from "@/modules/micro/services";
import { MicroItemData } from "@/modules/micro/types";
import { Heading, IconPlus } from "@/shared/components";
import Link from "next/link";

export interface VideoManagePageRootProps {}

export default function VideoManagePageRoot(_props: VideoManagePageRootProps) {
  const {
    data,
  }: {
    data: MicroItemData[] | undefined;
  } = useQueryVideosManage({ enabled: true });
  return (
    <div className="flex flex-col gap-10">
      <Heading>Quản lý videos</Heading>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {data?.map((video, index) => (
          <VideoItem isEdit key={index} data={video}></VideoItem>
        ))}
      </div>
      <Link
        href="/admin/micro/add-new"
        className="fixed bottom-10 right-10 z-50 size-10 bg-primary text-white hidden lg:flex items-center justify-center rounded-full"
        target="_blank"
      >
        <IconPlus />
      </Link>
    </div>
  );
}
