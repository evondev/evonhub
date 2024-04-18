import Image from "next/image";
import Link from "next/link";

type CardProps = {
  image: string;
  title: string;
  url: string;
  categories: string[];
};
const Card = () => {
  return (
    <div className="p-5 bg-white rounded-xl">
      <div className="relative h-[220px] mb-6">
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
        className="flex items-center justify-center gap-2 h-12 px-5 rounded-full gradient text-white font-medium ml-auto w-fit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
            clipRule="evenodd"
          />
        </svg>
        <span>Watch now</span>
      </Link>
    </div>
  );
};

export default Card;
