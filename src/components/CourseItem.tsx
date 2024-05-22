import { courseLevel } from "@/constants";
import { ICourse } from "@/database/course.model";
import { cn } from "@/lib/utils";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { IconLevel, IconLongArrowRight, IconStar } from "./icons";
import CourseItemWrapperSkeleton from "./loading/CourseItemWrapperSkeleton";

const IconLecture = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
    />
  </svg>
);
interface ICourseItemParams {
  data: {
    title: string;
    slug: string;
    image: string;
    level: ICourse["level"];
    price: ICourse["price"];
    rating: ICourse["rating"];
    salePrice: number;
    lecture: any[];
  };
  cta?: string;
  url?: string;
}
const CourseItem = ({ data, cta, url }: ICourseItemParams) => {
  const link = url ? `/${data.slug}${url}` : `/course/${data.slug}`;
  const rating =
    data?.rating?.reduce((acc, cur) => acc + cur, 0) / data?.rating?.length ||
    5.0;
  return (
    <Suspense fallback={<CourseItemWrapperSkeleton />}>
      <div className=" bg-white rounded-lg dark:bg-grayDark flex flex-col hover:shadow transition-all relative group">
        <Link href={link} className="absolute inset-0 z-10"></Link>
        <div className="relative h-[180px] block group rounded-lg">
          <Image
            src={data.image}
            priority
            alt=""
            width={800}
            height={360}
            className="w-full h-full object-cover rounded-lg transition-all"
            sizes="400px"
          ></Image>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 text-sm font-medium">
            <div className="flex items-center gap-2">
              <IconLevel className="size-4 fill-secondary stroke-secondary" />
              <span>{courseLevel[data.level]}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconStar className="size-4 fill-secondary" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="text-xl font-extrabold mb-5 line-clamp-3 block">
            {data.title}
          </h3>
          <div className="mt-auto flex ">
            <div className="flex items-center gap-2 text-sm">
              <div className="font-bold text-secondary">
                {formatThoundsand(data.price)} VNĐ
              </div>
              <div className=" text-slate-400 line-through">
                {formatThoundsand(data.salePrice)} VNĐ
              </div>
            </div>
            <button
              type="button"
              className={cn(
                "size-10 bg-primary rounded-lg ml-auto flex items-center justify-center text-white group p-1"
              )}
            >
              <div className="transition-all group-hover:translate-x-[2px]">
                <IconLongArrowRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CourseItem;
