import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="bg-[#222D3B] sticky top-0 left-0 py-8 px-5 hidden sm:block">
      <Link href="/" className="flex items-center gap-3 py-3 mb-5">
        <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-gradientPrimary p-3.5">
          <Image
            width={40}
            height={40}
            src="/logo.png"
            alt="EvonHub"
            className="object-contain max-w-full"
          ></Image>
        </span>
        <span className="text-xl font-semibold">EvonHub</span>
      </Link>
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/"
            className="flex items-center gap-2 p-3 rounded-xl  transition-all text-white bg-gradientPrimary font-semibold"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.28558 18.896V16.1441C8.28558 15.4416 8.88943 14.8721 9.63431 14.8721H12.3572C12.7149 14.8721 13.058 15.0061 13.3109 15.2446C13.5638 15.4832 13.7059 15.8067 13.7059 16.1441V18.896C13.7037 19.1881 13.8251 19.4689 14.0433 19.6762C14.2615 19.8834 14.5584 20 14.868 20H16.7257C17.5933 20.0021 18.4262 19.6786 19.0405 19.1007C19.6548 18.5229 20 17.7383 20 16.92V9.08017C20 8.41921 19.6893 7.79226 19.1517 7.3682L12.8322 2.60828C11.7329 1.77371 10.1579 1.80065 9.09142 2.67228L2.91612 7.3682C2.35312 7.77976 2.01663 8.40857 2 9.08017V16.912C2 18.6175 3.46594 20 5.27427 20H7.08954C7.73274 20 8.25547 19.5106 8.26013 18.904L8.28558 18.896Z"
                fill="currentColor"
              />
            </svg>
            <span>Home Page</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
