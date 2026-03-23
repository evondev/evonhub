"use client";
import { useUserContext } from "@/components/user-context";
import { formatNumberToCompact } from "@/lib/utils";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import { IconEye, IconStarFilled, IconViews } from "@/shared/components";
import { SimpleButton } from "@/shared/components/button";
import { Card, ProgressBar } from "@/shared/components/common";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { userMutationEnrollFree } from "../services/data/mutation-enroll-free.data";
import { CourseItemData } from "../types";

interface CourseItemProps {
  data: CourseItemData;
  cta?: string;
  url?: string;
  shouldHideInfo?: boolean;
  isIncoming?: boolean;
}

export function CourseItem({
  data,
  cta,
  url,
  shouldHideInfo = false,
  isIncoming = false,
}: CourseItemProps) {
  const navigateURL = url ? `/${data.slug}${url}` : `/course/${data.slug}`;
  const hasRating = data.rating?.length > 1;
  const rating = !hasRating
    ? 0
    : data?.rating?.reduce((accumulator, current) => accumulator + current, 0) /
        data?.rating?.length || 0;
  const courseId = data._id || "";
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";
  const isFree = !!data.free;
  const userCourseIds = userInfo?.courses;
  const isAlreadyEnrolled = userCourseIds?.some(
    (course) => course === courseId,
  );

  const { data: userProgress } = useQueryUserCourseProgress({
    userId: userId || "",
    courseId,
  });
  const mutationEnrollFree = userMutationEnrollFree();

  const handleEnrollFree = async () => {
    const response = await mutationEnrollFree.mutateAsync({
      slug: data.slug,
      userId,
    });
    if (response?.type === "success") {
      toast.success(response?.message);
      return;
    }
    toast.error(response?.message);
  };

  const { progress, current, total } = userProgress || {};

  return (
    <Card className="rounded-xl p-4 flex flex-col gap-5 transition-all relative">
      {/* <Link href={navigateURL} className="absolute inset-0 z-10"></Link> */}
      <div className="relative h-[180px] block group rounded-xl">
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
          className="w-full h-full object-cover rounded-xl transition-all"
          sizes="300px"
        ></Image>
      </div>
      <div className="flex-1 flex flex-col">
        {!shouldHideInfo && (
          <div className="flex gap-1 mb-3 justify-end h-4">
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
                  <div className="text-sm lg:text-base font-bold">
                    {isFree ? <></> : `${formatThoundsand(data.price)}`}
                  </div>
                  <div className="text-xs lg:text-sm font-semibold line-through text-gray-500">
                    {isFree ? "" : `${formatThoundsand(data.salePrice)}`}
                  </div>
                </div>
              </div>
            )}
          </div>
          {isFree && !!userId && !isIncoming && !isAlreadyEnrolled && (
            <div className="flex gap-5">
              <SimpleButton
                onClick={handleEnrollFree}
                className="flex-1 w-full from-textPrimary to-textPrimary"
              >
                Lụm luôn
              </SimpleButton>
              <Link href={navigateURL} className="block shrink-0">
                <SimpleButton className="size-12 p-2 min-w-12">
                  <IconEye />
                </SimpleButton>
              </Link>
            </div>
          )}
          {(!isFree || isIncoming) && !isAlreadyEnrolled && (
            <Link href={navigateURL} className="block self-stretch flex-1">
              <SimpleButton className="w-full">
                {cta || "Xem chi tiết"}
              </SimpleButton>
            </Link>
          )}
          {isAlreadyEnrolled && (
            <div className="flex gap-5">
              <Link href="/study" className="block self-stretch flex-1">
                <SimpleButton className="w-full  from-third to-third">
                  Khu vực học tập
                </SimpleButton>
              </Link>
              <Link href={navigateURL} className="block shrink-0">
                <SimpleButton className="size-12 p-2 min-w-12 from-third to-third">
                  <IconEye />
                </SimpleButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
