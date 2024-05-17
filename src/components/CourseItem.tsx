import { courseLevel } from "@/constants";
import { ICourse } from "@/database/course.model";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { IconClock, IconLevel, IconStar } from "./icons";

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
    createdAt: Date;
    lecture: {
      title: string;
      lessons: {
        title: string;
        duration: number;
      }[];
    }[];
    level: ICourse["level"];
    price: ICourse["price"];
  };
  cta?: string;
  url?: string;
}
const CourseItem = ({ data, cta, url }: ICourseItemParams) => {
  const link = url || `/course/${data.slug}`;
  const lectures = data.lecture;
  const totalMinutes = lectures?.reduce((acc, cur) => {
    return acc + cur?.lessons?.reduce((acc, cur) => acc + cur?.duration, 0);
  }, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  return (
    <div className=" bg-white rounded-lg dark:bg-grayDark flex flex-col">
      <Link
        href={link}
        className="relative h-[200px] block group rounded-xl"
        style={{
          transform: "translate3d(0, 0, 0) translateZ(0)",
        }}
      >
        <Image
          src={data.image}
          fill
          priority
          alt=""
          className="w-full h-full object-cover rounded-t-xl transition-all"
          sizes="400px"
        ></Image>
        {new Date(data.createdAt).getTime() >
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000 && (
          <span className="absolute right-5 top-5 z-10 text-white inline-flex px-3 py-1 rounded-full bg-green-500 text-xs font-semibold">
            Mới ra mắt
          </span>
        )}
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5 text-sm font-medium">
          <div className="flex items-center gap-2">
            <IconLevel />
            <span>{courseLevel[data.level]}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconStar className="size-4 fill-secondary" />
            <span>5.0</span>
          </div>
        </div>
        <Link href={link} className="text-xl font-bold mb-5 line-clamp-3 block">
          {data.title}
        </Link>
        <div className="mt-auto flex flex-col gap-8">
          <div className="flex items-center gap-10 text-sm">
            <div className="flex items-center gap-2">
              {IconLecture}
              <span>{data.lecture.length} Chương</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock />
              <span>{totalHours} Giờ học</span>
            </div>
          </div>

          <div className="font-bold text-secondary text-base">
            {formatThoundsand(data.price)} VNĐ
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
