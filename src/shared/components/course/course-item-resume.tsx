"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import { handleGetLastUrl } from "@/shared/helpers";
import Image from "next/image";
import Link from "next/link";
import { BadgeProgress, Card, ProgressBar } from "../common";

export interface CourseItemResumeProps {
  image: string;
  title: string;
  courseId: string;
  url?: string;
  lesson: {
    _id: string;
    slug: string;
  };
  slug: string;
}

export function CourseItemResume({
  image,
  title,
  courseId,
  slug,
  lesson,
}: CourseItemResumeProps) {
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";
  const { data: userProgress } = useQueryUserCourseProgress({
    userId,
    courseId,
  });
  const { progress, current, total } = userProgress || {};
  const url = `${slug}/lesson${handleGetLastUrl(slug, lesson)}`;

  return (
    <Card className="p-2 rounded-xl flex-wrap lg:flex-nowrap bgDarkMode flex items-center gap-3 lg:gap-5 relative overflow-clip">
      <Image
        src={image}
        priority
        alt={title}
        width={600}
        height={360}
        className="w-[100px] lg:w-[150px] aspect-square object-cover rounded-lg transition-all"
        sizes="300px"
      ></Image>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-xs sm:text-base leading-loose lg:text-base 2xl:text-lg">
          {title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <BadgeProgress progress={progress || 0} />
          <Card className="lg:hidden rounded-lg self-end">
            <Link
              href={url}
              className="font-semibold py-2 block w-max text-xs lg:text-sm px-3 lg:px-5 rounded-lg hover:text-primary dark:hover:text-white"
            >
              Tiếp tục học
            </Link>
          </Card>
        </div>

        <ProgressBar
          progress={progress || 0}
          wrapperClassName="absolute bottom-0 left-2 right-2 rounded-none"
          className="h-[2px] lg:h-1 bg-transparent rounded-none"
          current={current}
          total={total}
        />
      </div>
      <div className="shrink-0 w-full gap-3 items-end hidden lg:flex justify-end lg:block lg:w-auto lg:ml-auto lg:absolute lg:bottom-2 lg:right-2">
        <Card className="rounded-lg">
          <Link
            href={url}
            className="font-semibold py-2 block w-full text-xs lg:text-sm px-3 lg:px-5 rounded-lg hover:text-primary dark:hover:text-white"
          >
            Tiếp tục học
          </Link>
        </Card>
      </div>
    </Card>
  );
}
