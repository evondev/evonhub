import GoBack from "@/components/GoBack";

const PageNotFound = () => {
  return (
    <div className="py-5 lg:py-20">
      <h1 className="text-3xl lg:text-5xl mb-5 font-bold text-center flex flex-col gap-5 items-center">
        <span className="text-gradient inline-block text-7xl">404</span>
        <span>Không tìm thấy trang</span>
      </h1>
      <p className="text-center text-lg max-w-[600px] mx-auto mb-10 text-gray-500">
        Dường như trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Hãy kiểm
        tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <GoBack title="Về trang chủ"></GoBack>
    </div>
  );
};

export default PageNotFound;
