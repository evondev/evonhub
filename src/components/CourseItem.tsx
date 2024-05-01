import { ICourse } from "@/database/course.model";
import Image from "next/image";
import Link from "next/link";

const CourseItem = ({ data }: { data: ICourse }) => {
  return (
    <div className=" bg-white rounded-md dark:bg-grayDark flex flex-col">
      <div className="relative h-[220px]">
        <Image
          src=""
          fill
          priority
          alt=""
          className="w-full h-full object-cover rounded-md"
        ></Image>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <Link
          href="/"
          className="uppercase inline-block py-1 px-4 rounded text-xs bg-primary bg-opacity-10 font-bold text-primary mb-4 self-start"
        >
          HTML CSS
        </Link>
        <h3 className="text-xl font-bold leading-normal mb-2 line-clamp-3">
          {data.title}
        </h3>
        <div className="mt-auto">
          <div className="font-semibold text-gray-500 mb-10 text-base">
            {data.price} VNĐ
          </div>
          <Link
            href={`/course/${data.slug}`}
            className="flex items-center justify-center gap-1 h-12 px-5 rounded-md bg-primary text-white font-semibold ml-auto w-fit group"
          >
            <span>View details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 group-hover:translate-x-2 transition-transform"
            >
              <path
                fillRule="evenodd"
                d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
