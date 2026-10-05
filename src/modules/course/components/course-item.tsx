"use client";
import { useUserContext } from "@/components/user-context";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import { ProgressBar } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseItemData } from "../types";
import { formatRating, getAverageRating, isCourseFree } from "../utils";

interface CourseItemProps {
  data: CourseItemData;
  cta?: string;
  url?: string;
  /** Ẩn giá và đánh giá, chỉ ghi lượt xem. Mặc định ẩn như trước */
  shouldHideInfo?: boolean;
  isIncoming?: boolean;
}

export function CourseItem({
  data,
  url,
  shouldHideInfo = true,
}: CourseItemProps) {
  const navigateURL = url ? `/${data.slug}${url}` : `/course/${data.slug}`;
  const ratings = data.rating || [];
  const isFree = isCourseFree(data);
  const hasOriginalPrice = !isFree && data.salePrice > data.price;
  const { userInfo } = useUserContext();
  const { data: userProgress } = useQueryUserCourseProgress({
    userId: userInfo?._id || "",
    courseId: data._id || "",
  });
  const { progress, current, total } = userProgress || {};

  return (
    <Link
      href={navigateURL}
      className="group flex min-w-0 overflow-hidden rounded-2xl border border-border bg-surface outline-none transition-colors hover:border-border-strong sm:flex-col"
    >
      <Image
        src={data.image}
        alt=""
        width={600}
        height={338}
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 112px"
        className="w-28 shrink-0 object-cover sm:aspect-video sm:w-full"
      />
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-pretty text-sm font-semibold text-foreground sm:text-base">
          {data.title}
        </h3>
        {url && (
          <div className="mt-3 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <ProgressBar
                progress={progress || 0}
                className="h-1.5 bg-foreground/5 dark:bg-foreground/5"
              />
            </div>
            <span className="shrink-0 text-xs tabular-nums text-muted">
              {current || 0} / {total || 0} bài
            </span>
          </div>
        )}
        <div className="mt-auto flex items-baseline justify-between gap-3 whitespace-nowrap pt-3 sm:pt-4">
          {shouldHideInfo ? (
            <span className="text-xs tabular-nums text-muted">
              {formatThoundsand(data.views)} lượt xem
            </span>
          ) : (
            <span className="flex min-w-0 items-baseline gap-2">
              <span
                className={cn(
                  "text-base font-semibold tabular-nums",
                  isFree && "text-emerald-700 dark:text-emerald-400",
                  !isFree && "text-foreground",
                )}
              >
                {isFree ? "Miễn phí" : `${formatThoundsand(data.price)} đ`}
              </span>
              {hasOriginalPrice && (
                <span className="truncate text-xs tabular-nums text-muted line-through">
                  {formatThoundsand(data.salePrice)} đ
                </span>
              )}
            </span>
          )}
          {!shouldHideInfo && ratings.length > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted">
              <Star className="size-3.5 fill-current text-amber-500" />
              {formatRating(getAverageRating(ratings))}
            </span>
          )}
          {shouldHideInfo && isFree && (
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Miễn phí
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
