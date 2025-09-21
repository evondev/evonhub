"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/components/user-context";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import Image from "next/image";
import Link from "next/link";
import { BadgeProgress, ProgressBar } from "../common";

export interface CourseItemResumeProps {
  image: string;
  title: string;
  courseId: string;
  url?: string;
}

export function CourseItemResume({
  image,
  title,
  courseId,
  url = "/study",
}: CourseItemResumeProps) {
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";
  const { data: userProgress } = useQueryUserCourseProgress({
    userId,
    courseId,
  });
  const { progress, current, total } = userProgress || {};

  return (
    <div className="p-3 rounded-xl flex-wrap lg:flex-nowrap bgDarkMode flex items-center gap-3 lg:gap-5">
      <Image
        src={image}
        priority
        alt={title}
        width={600}
        height={360}
        className="w-[100px] lg:w-[150px] aspect-square object-cover rounded-lg transition-all"
        sizes="300px"
      ></Image>
      <div className="flex flex-col gap-2 flex-1 max-w-[500px]">
        <h3 className="font-bold text-sm lg:text-base">{title}</h3>
        <BadgeProgress progress={progress || 0} />
        <ProgressBar
          progress={progress || 0}
          wrapperClassName="hidden lg:block mt-1"
          className="h-1"
          current={current}
          total={total}
          shouldShowLabel
        />
      </div>
      <div className="shrink-0 w-full gap-3 items-end flex justify-end lg:block lg:w-auto lg:ml-auto">
        <ProgressBar
          progress={progress || 0}
          current={current}
          total={total}
          className="h-1"
          wrapperClassName="block lg:hidden flex-1"
          shouldShowLabel
        />
        <Link href={url} className="">
          <Button
            variant="primary"
            size="lg"
            className="w-max ml-auto h-10 px-5 lg:h-12 lg:px-10"
          >
            Học tiếp
          </Button>
        </Link>
      </div>
    </div>
  );
}
