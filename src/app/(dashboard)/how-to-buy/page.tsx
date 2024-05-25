import Image from "next/image";

const page = () => {
  return (
    <div>
      <h1 className="font-extrabold mb-5 text-3xl">
        Hướng dẫn mua khóa học tại Evonhub
      </h1>
      <div className="mb-5">
        Các bạn bấm vào mục <strong>Khám phá</strong> để tìm kiếm khóa học. Sau
        đó bấm vào khóa học để xem thông tin. Các bạn sẽ thấy giá khóa học{" "}
        <strong className="text-secondary">màu cam</strong>.
        <Image src="/tut1.png" alt="bank" width={300} height={600}></Image>
        Các bạn chuyển khoản vào tài khoản dưới với nội dung{" "}
        <strong>khóa học + email</strong>
      </div>
      <div className="mb-5">
        Ví dụ: <strong>nextjspro+evonhub1402</strong>
      </div>
      <div className="mb-5">
        <Image src="/acb.jpeg" alt="bank" width={300} height={600}></Image>
      </div>
      <div className="mb-5">
        Sau đó các bạn nhấn vào nút{" "}
        <strong className="text-secondary">màu cam</strong> để liên hệ mình nhé.
        Nhớ tạo tài khoản và gửi email cho mình để mình kiểm tra nha.
      </div>
      <div>
        <Image src="/tut2.png" alt="bank" width={300} height={600}></Image>
      </div>
    </div>
  );
};

export default page;
