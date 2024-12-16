import { primaryButtonClassName } from "@/constants";
import { ICourse } from "@/database/course.model";
import { cn } from "@/lib/utils";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { IconStar, IconViews } from "./icons";
import CourseItemWrapperSkeleton from "./loading/CourseItemWrapperSkeleton";
import { Button } from "./ui/button";

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
    views: number;
    free: boolean;
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
      <div className=" bg-white/30 backdrop-blur-xl border border-white dark:border-white/10 rounded-lg p-3 flex flex-col transition-all relative dark:bg-grayDarkest">
        <Link href={link} className="absolute inset-0 z-10"></Link>
        <div className="bg-white rounded-lg h-full flex flex-col p-3 dark:bg-grayDarker">
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
          <div className="py-5 flex-1 flex flex-col">
            <h3 className="text-base lg:text-lg font-bold mb-5 line-clamp-3 block">
              {data.title}
            </h3>
            <div className="mt-auto">
              <div className="flex items-center gap-3 mb-5 justify-between">
                <div className="flex items-center gap-3 text-xs lg:text-sm font-medium text-gray-500 dark:text-white dark:text-opacity-60">
                  {/* <div className="flex items-center gap-2">
                  <IconLevel className="size-4" />
                  <span>{courseLevel[data.level]}</span>
                </div> */}
                  <div className="flex items-center gap-2">
                    <IconStar className="size-4 stroke-current fill-transparent flex-shrink-0" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconViews className="size-4 stroke-current fill-transparent flex-shrink-0" />
                    <span>{data.views}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-sm lg:text-base font-bold text-secondary">
                      {data.free
                        ? "Miễn phí"
                        : `${formatThoundsand(data.price)}`}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-1 border border-[#f6f6f8] rounded-xl bg-[#f6f6f8]/30 backdrop-blur-xl dark:bg-grayDarkest dark:border-white/10">
                <Button className={cn(primaryButtonClassName, "w-full h-12")}>
                  {!url ? "Xem chi tiết" : "Học tiếp"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CourseItem;
