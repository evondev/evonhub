import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="top py-8 mb-5 flex items-center justify-between gap-5">
      <div className="rounded-full gap-4 h-12 px-5 bg-white w-[min(100%,390px)] flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent w-full text-sm"
        />
        <button className="text-grayb2">
          <svg
            width={22}
            height={22}
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx={11}
              cy="10.5"
              r="8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 17L19.5 20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-5">
        <Link href="/profile" className="rounded-full size-10">
          <Image
            alt=""
            src="https://spotlight-modern.highfivethemes.com/content/images/size/w800/format/webp/2023/06/demo-image-00002-1.webp"
            width={80}
            height={80}
            className="w-full h-full rounded-full object-cover"
          ></Image>
        </Link>
      </div>
    </div>
  );
};

export default Header;
