import Image from "next/image";
import Link from "next/link";
import { IconPlay } from "./icons";

type CardProps = {
  image: string;
  title: string;
  url: string;
  categories: string[];
};
const Card = () => {
  return (
    <div className="p-5 bg-white rounded-xl dark:bg-grayDark">
      <div className="relative h-[180px] mb-6">
        <Image
          src="https://spotlight-modern.highfivethemes.com/content/images/size/w1000/format/webp/2023/06/demo-image-00007.webp"
          fill
          priority
          alt=""
          className="w-full h-full object-cover rounded-lg"
        ></Image>
      </div>
      <Link
        href="/"
        className="uppercase inline-block py-1 px-4 rounded text-xs bg-primary bg-opacity-10 font-semibold text-primary mb-4"
      >
        HTML CSS
      </Link>
      <h3 className="text-xl font-bold leading-normal mb-6 tracking-wide">
        Khóa học HTML CSS từ cơ bản đến nâng cao dành cho người mới
      </h3>
      <Link
        href="/"
        className="flex items-center justify-center gap-2 h-12 px-5 rounded-lg gradient text-white font-medium ml-auto w-fit"
      >
        <IconPlay />
        <span>Watch now</span>
      </Link>
    </div>
  );
};

export default Card;
