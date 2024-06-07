import { primaryButtonClassName } from "@/constants";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <h1 className=" text-secondary font-bold text-xl inline-block mb-5">
        Khóa học Coaching Online 101 với Evondev
      </h1>
      <div></div>
      <Link
        href="https://fb.com/tuan.trananh.0509"
        className={primaryButtonClassName}
      >
        Liên hệ
      </Link>
    </div>
  );
};

export default page;
