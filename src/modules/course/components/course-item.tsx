"use client";
import { formatNumberToCompact } from "@/lib/utils";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import { IconStarFilled, IconViews } from "@/shared/components";
import { SimpleButton } from "@/shared/components/button";
import { Card, ProgressBar } from "@/shared/components/common";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { CourseItemData } from "../types";

interface CourseItemProps {
  data: CourseItemData;
  cta?: string;
  url?: string;
  userId?: string;
  shouldHideInfo?: boolean;
}

export function CourseItem({
  data,
  cta,
  url,
  userId,
  shouldHideInfo = false,
}: CourseItemProps) {
  const navigateURL = url ? `/${data.slug}${url}` : `/course/${data.slug}`;
  const hasRating = data.rating?.length > 1;
  const rating = !hasRating
    ? 0
    : data?.rating?.reduce((accumulator, current) => accumulator + current, 0) /
        data?.rating?.length || 0;
  const courseId = data._id || "";
  const isFree = !!data.free;

  const { data: userProgress } = useQueryUserCourseProgress({
    userId: userId || "",
    courseId,
  });

  const { progress, current, total } = userProgress || {};

  return (
    <Card className="rounded-lg p-4 flex flex-col gap-5 transition-all relative">
      {/* <Link href={navigateURL} className="absolute inset-0 z-10"></Link> */}
      <div className="relative h-[180px] block group rounded-lg">
        {isFree && (
          <div className="flex items-center gap-2 p-2 rounded-md absolute right-2 top-2 text-xs font-bold text-white bg-green-400">
            <span>Khóa học miễn phí</span>
          </div>
        )}
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
        {!shouldHideInfo && (
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
        )}

        {url && (
          <ProgressBar
            progress={progress || 0}
            current={current}
            total={total}
            className="mb-2"
            shouldShowLabel
          />
        )}
        <h3 className="text-base font-bold mb-5 line-clamp-3 block">
          {data.title}
        </h3>
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-3 justify-between">
            <div className="flex items-center gap-3 text-xs lg:text-sm font-medium text-gray-500 dark:text-white dark:text-opacity-60">
              <div className="flex items-center gap-2">
                <IconViews className="size-4 stroke-current fill-transparent flex-shrink-0" />
                <span>{formatNumberToCompact(data.views)}</span>
              </div>
            </div>
            {!shouldHideInfo && (
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="text-sm lg:text-lg font-bold text-secondary">
                    {isFree ? <></> : `${formatThoundsand(data.price)}`}
                  </div>
                  <div className="text-sm lg:text-base font-semibold line-through text-gray-500">
                    {isFree ? "" : `${formatThoundsand(data.salePrice)}`}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href={navigateURL} className="block">
            <SimpleButton className="w-full">
              {cta ? cta : "Xem chi tiết"}
            </SimpleButton>
          </Link>
        </div>
      </div>
    </Card>
  );
}
