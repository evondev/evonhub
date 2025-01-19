"use client";
import { useQueryOrderCountByCourse } from "@/modules/order/services";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import { IconStar, IconStarFilled, IconViews } from "@/shared/components";
import { SimpleButton } from "@/shared/components/button";
import { ProgressBar } from "@/shared/components/common";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { CourseItemData } from "../types";
import { CourseBadge } from "./course-badge";

interface CourseItemProps {
  data: CourseItemData;
  cta?: string;
  url?: string;
  userId?: string;
}

export function CourseItem({ data, cta, url, userId }: CourseItemProps) {
  const navigateURL = url ? `/${data.slug}${url}` : `/course/${data.slug}`;
  const hasRating = data.rating?.length > 1;
  const rating = !hasRating
    ? 0
    : data?.rating?.reduce((acc, cur) => acc + cur, 0) / data?.rating?.length ||
      0;
  const courseId = data._id || "";
  const isFree = !!data.free;

  const { data: progress } = useQueryUserCourseProgress({
    userId: userId || "",
    courseId,
  });

  const { data: orderCount } = useQueryOrderCountByCourse({
    courseId,
  });

  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white dark:border-white/10 rounded-lg p-3 flex flex-col transition-all relative dark:bg-grayDarkest">
      <Link href={navigateURL} className="absolute inset-0 z-10"></Link>
      <div className="bg-white rounded-lg h-full flex flex-col p-3 gap-3 dark:bg-grayDarker">
        <div className="relative h-[180px] block group rounded-lg">
          <CourseBadge orderCount={orderCount || 0} />
          <Image
            src={data.image}
            priority
            alt=""
            width={600}
            height={360}
            className="w-full h-full object-cover rounded-lg transition-all"
            sizes="300px"
          ></Image>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex gap-1 mb-2 justify-end h-4">
            {Array(5)
              .fill(0)
              .map((_, index) => {
                if (Math.floor(rating) < index + 1)
                  return (
                    <IconStarFilled
                      key={index}
                      className="size-4 fill-gray-300 dark:fill-white/50"
                    />
                  );
                return (
                  <Image
                    key={index}
                    alt="rating"
                    src="/star.png"
                    width={16}
                    height={16}
                  />
                );
              })}
          </div>

          {url && <ProgressBar progress={progress || 0} className="mb-2" />}
          <h3 className="text-base lg:text-lg font-bold mb-5 line-clamp-3 block">
            {data.title}
          </h3>
          <div className="mt-auto">
            <div className="flex items-center gap-3 mb-3 justify-between">
              <div className="flex items-center gap-3 text-xs lg:text-sm font-medium text-gray-500 dark:text-white dark:text-opacity-60">
                <div className="flex items-center gap-2">
                  <IconStar className="size-4 stroke-current fill-transparent flex-shrink-0" />
                  <span>
                    {data.rating?.length > 1 ? data.rating?.length : 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconViews className="size-4 stroke-current fill-transparent flex-shrink-0" />
                  <span>{data.views}</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="text-sm lg:text-base font-bold text-secondary">
                    {isFree ? "" : `${formatThoundsand(data.price)}`}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-1 border border-[#f6f6f8] rounded-xl bg-[#f6f6f8]/30 backdrop-blur-xl dark:bg-grayDarkest dark:border-white/10">
              <SimpleButton className="w-full">
                {cta ? cta : isFree ? "Miễn phí" : "Xem chi tiết"}
              </SimpleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
