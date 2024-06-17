import Image from "next/image";
import Link from "next/link";

const EmptyData = ({ text, url }: { text?: string; url?: string }) => {
  return (
    <div className="bg-white dark:bg-grayDarker max-w-[500px] mx-auto p-5 rounded-lg my-5 text-center">
      <Image
        alt=""
        src="/content.svg"
        width={50}
        height={50}
        className="mx-auto mb-5"
      />
      {text ||
        ` Không tìm thấy nội dung bạn yêu cầu. Có thể bạn chưa đăng nhập, tài khoản
      của bạn chưa được kích hoạt hoặc bị khóa vì vi phạm chính sách hệ thống.
      Vui lòng liên hệ với quản trị viên để được hỗ trợ.`}
      <Link
        href={url || "/"}
        className="text-white bg-grayPrimary rounded-full h-10 px-10 flex items-center justify-center gap-2 w-fit mx-auto group mt-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 group-hover:-translate-x-3 transition-transform"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        {!url ? <span>Khu vực học tập</span> : <span>Liên hệ</span>}
      </Link>
    </div>
  );
};

export default EmptyData;
