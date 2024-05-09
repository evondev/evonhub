import { primaryButtonClassName } from "@/constants";
import { ICourse } from "@/database/course.model";
import { cn } from "@/lib/utils";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { IconLongArrowRight } from "./icons";

const CourseItem = ({
  data,
  cta,
  url,
}: {
  data: ICourse;
  cta?: string;
  url?: string;
}) => {
  const link = url || `/course/${data.slug}`;
  return (
    <div className=" bg-white rounded-md dark:bg-grayDark flex flex-col">
      <Link
        href={link}
        className="relative h-[200px] block group overflow-hidden rounded-md"
        style={{
          transform: "translate3d(0, 0, 0) translateZ(0)",
        }}
      >
        <Image
          src={data.image}
          fill
          priority
          alt=""
          className="w-full h-full object-cover rounded-md group-hover:scale-125 transition-all"
          sizes="400px"
        ></Image>
        <span className="absolute right-5 top-5 z-10 text-white inline-flex px-3 py-1 rounded-full bg-green-500 text-xs font-semibold">
          Mới ra mắt
        </span>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        {/* <Link
          href="/"
          className="uppercase inline-block py-1 px-4 rounded text-xs bg-primary bg-opacity-10 font-bold text-primary mb-4 self-start"
        >
          HTML CSS
        </Link> */}
        <Link
          href={link}
          className="text-xl font-extrabold mb-2 line-clamp-3 block"
        >
          {data.title}
        </Link>
        <div className="mt-auto">
          <div className="font-semibold text-gray-500 mb-6 text-base">
            {formatThoundsand(data.price)} VNĐ
          </div>
          <Link
            href={link}
            className={cn(primaryButtonClassName, "ml-auto w-fit flex group")}
          >
            <span>{cta || "Thông tin khóa học"}</span>
            <IconLongArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
