import Image from "next/image";

const page = () => {
  return (
    <div className="">
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
        Khi mình nhận được thanh toán, mình sẽ chủ động thêm khóa học vào tài
        khoản cho các bạn. Nếu sau 24h mà không nhận được khóa học, các bạn vui
        lòng liên hệ mình fb cá nhân mình tại:{" "}
        <a
          href="https://fb.com/tuan.trananh.0509"
          target="_blank"
          className="text-primary font-bold"
        >
          https://fb.com/tuan.trananh.0509
        </a>
      </div>
    </div>
  );
};

export default page;
