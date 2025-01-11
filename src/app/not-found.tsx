"use client";
import { useRouter } from "next/navigation";

const PageNotFound = () => {
  const router = useRouter();
  const handleRedirect = () => {
    const history = globalThis.history;

    if (history.length > 1) {
      router.back();
    } else {
      router.push("/study");
    }
  };
  return (
    <div className="py-5 lg:py-20">
      <h1 className="text-3xl lg:text-5xl mb-5 font-bold text-center flex flex-col gap-5 items-center">
        <span className="text-gradient inline-block text-[100px] relative">
          <span className="text-primary">4</span>
          <span>0</span>
          <span className="text-secondary">4</span>
        </span>
        <span className="font-extrabold">Không tìm thấy trang</span>
      </h1>
      <p className="text-center text-base lg:text-xl max-w-[600px] mx-auto mb-10 text-gray-500">
        Dường như trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <button
        onClick={handleRedirect}
        className="mx-auto flex items-center justify-center h-12 px-5 rounded-full bg-primary text-white font-bold min-w-[200px]"
      >
        Quay lại
      </button>
    </div>
  );
};

export default PageNotFound;
