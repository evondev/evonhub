import Image from "next/image";

const EmptyData = ({ text }: { text?: string }) => {
  return (
    <div className="bg-white max-w-[500px] mx-auto p-5 rounded-lg my-5 text-center">
      <Image
        alt=""
        src="/content.svg"
        width={120}
        height={120}
        className="mx-auto mb-5"
      />
      {text ||
        ` Không tìm thấy nội dung bạn yêu cầu. Có thể bạn chưa đăng nhập, tài khoản
      của bạn chưa được kích hoạt hoặc bị khóa vì vi phạm chính sách hệ thống.
      Vui lòng liên hệ với quản trị viên để được hỗ trợ.`}
    </div>
  );
};

export default EmptyData;
