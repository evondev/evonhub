"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryUserCourseProgress } from "@/modules/user/services";
import { handleGetLastUrl } from "@/shared/helpers";
import Image from "next/image";
import Link from "next/link";
import { BadgeProgress, ProgressBar } from "../common";
import { IconPlay } from "../icons";

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
    <Link
      href={url}
      className="p-2 rounded-xl flex-wrap lg:flex-nowrap bgDarkMode flex items-center gap-3 lg:gap-5 relative overflow-clip borderDarkMode group transition-all"
    >
      <div className="relative w-[100px] shrink-0">
        <Image
          src={image}
          priority
          alt={title}
          width={600}
          height={360}
          className="w-full aspect-square object-cover rounded-lg transition-all"
          sizes="300px"
        ></Image>
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
        <div className="size-8 flex items-center justify-center rounded-full bg-primary text-white absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-all shadow-lg">
          <IconPlay className="size-5" />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-xs leading-loose lg:text-sm pr-5">
          {title}
        </h3>
        <BadgeProgress progress={progress || 0} />

        <ProgressBar
          progress={progress || 0}
          wrapperClassName="absolute bottom-0 left-2 right-2 rounded-none"
          className="h-[2px] bg-transparent rounded-none"
          current={current}
          total={total}
        />
      </div>
    </Link>
  );
}
