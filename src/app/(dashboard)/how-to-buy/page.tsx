import Image from "next/image";
export async function generateMetadata() {
  return {
    title: "Hướng dẫn mua khóa học tại Evonhub",
    description:
      "Trong bài này mình sẽ hướng dẫn các bạn cách mua khóa học tại EvonHub",
    keywords:
      "evonhub, hướng dẫn mua khóa học tại evonhub, khóa học frontend, khóa học evonhub",
    openGraph: {
      title: "Hướng dẫn mua khóa học tại Evonhub",
      description:
        "Trong bài này mình sẽ hướng dẫn các bạn cách mua khóa học tại EvonHub",
      keywords:
        "evonhub, hướng dẫn mua khóa học tại evonhub, khóa học frontend, khóa học evonhub",
      images: ["/seo-cover.jpg"],
    },
  };
}
const page = () => {
  return (
    <div className="">
      <h1 className="font-extrabold mb-5 text-3xl">
        Hướng dẫn mua khóa học tại Evonhub
      </h1>
      <div className="mb-5 p-3 bg-secondary bg-opacity-10 text-secondary rounded-lg inline-block">
        <strong>Lưu ý:</strong> Nếu khóa học miễn phí thì nhấn vào nút{" "}
        <strong className="text-secondary">lụm liền</strong> là xong nha. Nhớ
        tạo tài khoản và đăng nhập nhé.
      </div>
      <div className="mb-5">
        Các bạn bấm vào mục <strong>Khám phá</strong> để tìm kiếm khóa học. Sau
        đó bấm vào khóa học để xem thông tin. Các bạn sẽ thấy giá khóa học{" "}
        <strong className="text-secondary">màu cam</strong>.
        <p className="my-5">
          <Image src="/tut1.png" alt="bank" width={300} height={600}></Image>
        </p>
        Các bạn chuyển khoản vào tài khoản dưới với nội dung{" "}
        <strong>khóa học email</strong> mà không cần dấu @ đồ phía sau nha.
      </div>
      <div className="mb-5">
        Ví dụ: <strong>nextjspro emailcuaban</strong>
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
