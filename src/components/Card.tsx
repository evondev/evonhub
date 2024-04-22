import Image from "next/image";
import Link from "next/link";

type CardProps = {
  image: string;
  title: string;
  url: string;
  categories: string[];
  videos: number;
  duration: number;
  level: string;
  students: number;
  rating: number;
  price: number;
  label: string;
};
const Card = () => {
  return (
    <div className=" bg-white rounded-md dark:bg-grayDark">
      <div className="relative h-[220px]">
        <Image
          src="https://spotlight-modern.highfivethemes.com/content/images/size/w1000/format/webp/2023/06/demo-image-00007.webp"
          fill
          priority
          alt=""
          className="w-full h-full object-cover rounded-md"
        ></Image>
      </div>
      <div className="p-5">
        <Link
          href="/"
          className="uppercase inline-block py-1 px-4 rounded text-xs bg-primary bg-opacity-10 font-bold text-primary mb-4"
        >
          HTML CSS
        </Link>
        <h3 className="text-xl font-bold leading-normal mb-6 tracking-wide">
          Khóa học HTML CSS từ cơ bản đến nâng cao dành cho người mới
        </h3>
        <Link
          href="/course/html-css"
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
  );
};

export default Card;
