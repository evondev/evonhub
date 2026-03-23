"use client";

import { useQueryVideosManage } from "@/modules/micro/services";
import { MicroItemData } from "@/modules/micro/types";
import { IconEdit, IconPlus } from "@/shared/components";
import Link from "next/link";

export interface VideoManagePageRootProps {}

export default function VideoManagePageRoot(_props: VideoManagePageRootProps) {
  const {
    data,
  }: {
    data: MicroItemData[] | undefined;
  } = useQueryVideosManage({ enabled: true });
  return (
    <>
      <div className="flex flex-col gap-5">
        {data?.map((video, index) => (
          <div key={index} className="flex items-center gap-2">
            <h3>{video.title}</h3>
            <Link href={`/admin/micro/update?slug=${video.slug}`}>
              <IconEdit />
            </Link>
          </div>
        ))}
      </div>
      <Link
        href="/admin/micro/add-new"
        className="fixed bottom-10 right-10 z-50 size-10 bg-primary text-white hidden lg:flex items-center justify-center rounded-full"
        target="_blank"
      >
        <IconPlus />
      </Link>
    </>
  );
}
