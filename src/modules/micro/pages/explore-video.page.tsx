"use client";

import { Heading, IconVideo } from "@/shared/components";
import { SimpleButton } from "@/shared/components/button";
import Link from "next/link";
import { useQueryVideos } from "../services";

export interface ExploreVideoPageProps {}

export function ExploreVideoPage(_props: ExploreVideoPageProps) {
  const { data } = useQueryVideos({});
  return (
    <div className="flex flex-col gap-10">
      <Heading>Học qua Videos</Heading>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {data?.map((item) => (
          <div
            key={item.slug}
            className="border borderDarkMode bgDarkMode p-3 rounded-md"
          >
            <h4 className="uppercase text-gray-500 text-xs font-medium mb-1">
              Video
            </h4>
            <h3 className="font-bold text-sm lg:text-lg mb-5">{item.title}</h3>
            <div
              className="text-sm text-gray-700 mb-5 dark:text-white"
              dangerouslySetInnerHTML={{ __html: item.content }}
            ></div>
            <div className="flex items-center justify-between gap-2 border-t border-t-gray-200 dark:border-t-gray-200/10 pt-5">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white">
                <IconVideo className="size-5" />
                <span>{item.duration} phút</span>
              </div>
              <Link href={`/micro/${item.slug}`}>
                <SimpleButton className="w-full">Học ngay</SimpleButton>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
