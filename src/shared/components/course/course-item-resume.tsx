"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/components/user-context";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import Image from "next/image";
import Link from "next/link";
import { ProgressBar } from "../common";

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
  const { data: progress } = useQueryUserCourseProgress({
    userId,
    courseId,
  });

  return (
    <div className="p-3 rounded-xl flex-wrap lg:flex-nowrap bgDarkMode flex items-center gap-2 lg:gap-5">
      <Image
        src={image}
        priority
        alt=""
        width={600}
        height={360}
        className="w-[150px] aspect-video object-cover rounded-lg transition-all"
        sizes="300px"
      ></Image>
      <div className="flex flex-col gap-3 flex-1 max-w-[500px]">
        <h3 className="font-bold text-base lg:text-lg">{title}</h3>
        <ProgressBar progress={progress || 0} className="hidden lg:block" />
      </div>
      <div className="shrink-0 w-full gap-3 items-center flex justify-end lg:block lg:w-auto lg:ml-auto">
        <ProgressBar
          progress={progress || 0}
          className="block lg:hidden flex-1"
        />
        <Link href={url} className="">
          <Button variant="primary" size="lg" className="w-max ml-auto">
            Học tiếp
          </Button>
        </Link>
      </div>
    </div>
  );
}
