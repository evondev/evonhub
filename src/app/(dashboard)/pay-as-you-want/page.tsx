import { Heading } from "@/shared/components";

export interface PayAsYouWantPageRootProps {}

export default function PayAsYouWantPageRoot(
  _props: PayAsYouWantPageRootProps
) {
  return (
    <div className="leading-loose">
      <Heading>Pay as you want</Heading>
      <p className="mb-5">
        Là một hình thức thanh toán khóa học theo giá mà các bạn muốn mua với
        mức tối thiểu mà tác giả chấp nhận được. Giá mà tác giả chấp nhận được
        là giá mà được tác giả thiết lập cho khóa học.
      </p>
      <p className="mb-5">
        Có thể khóa học có giá là{" "}
        <strong className="text-primary">99.000</strong> nhưng tác giả thiết lập
        giá chấp nhận được là <strong className="text-secondary">49.000</strong>{" "}
        thì các bạn cũng có thể mua giá{" "}
        <strong className="text-secondary">49.000</strong>. Giá chấp nhận được
        sẽ nhỏ hơn, bằng giá hoặc thậm chí cao hơn(nếu các bạn ủng hộ tác giả)
        khóa học. Hình thức này mình làm ra với mục đích dành cho các khóa giá
        rẻ sắp tới trên hệ thống của mình.
      </p>
      <p>
        Khi tính năng này ra mắt khi mua các bạn sẽ thấy khung nhập giá(nếu tác
        giả kích hoạt) hoặc hiển thị như bình thường.
      </p>
    </div>
  );
}
