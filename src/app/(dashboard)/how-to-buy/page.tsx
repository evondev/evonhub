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
          <Image src="/widget.png" alt="bank" width={300} height={600}></Image>
        </p>
        Sau đó các bạn nhấn vào button để mua khóa học. Lúc này các bạn sẽ thấy
        nội dung như sau:
      </div>
      <div className="mb-5">
        <Image src="/order.png" alt="order" width={600} height={600}></Image>
      </div>
      <div className="mb-5">
        Tại đây các bạn sẽ thấy thông tin ngân hàng và số tiền cần thanh toán.
        Các bạn chỉ cần chuyển khoản vào tài khoản ngân hàng đó với nội dung là
        mã đơn hàng
      </div>
      <div className="mb-5">
        Ví dụ: <strong className="text-secondary">DH43522145</strong>
      </div>
      <div className="mb-5">
        Khi đơn hàng được tạo, tác giả sẽ chủ động thêm khóa học vào tài khoản
        cho các bạn. Nếu sau 24h mà không nhận được khóa học, các bạn vui lòng
        liên hệ Admin tại:{" "}
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
