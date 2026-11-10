import { QrCode, UserRound } from "lucide-react";
import {
  HowToBuyPaymentMethod,
  HowToBuyStep,
  HowToBuyTrouble,
} from "../types/how-to-buy.types";

export const howToBuySteps: HowToBuyStep[] = [
  {
    title: "Chọn khóa học",
    description:
      "Vào Danh sách khóa học, bấm vào khóa bạn muốn để xem nội dung, giá và chuyên gia dạy khóa đó.",
    link: { label: "Xem danh sách khóa học", href: "/explore" },
  },
  {
    title: "Bấm nút mua để tạo đơn",
    description:
      "Đăng nhập rồi bấm nút mua trên trang khóa. Bạn được chuyển tới trang đơn hàng có mã đơn riêng, đơn giữ trong 24 giờ.",
    codeExample: "DH43522145",
  },
  {
    title: "Chuyển khoản theo trang đơn hàng",
    description:
      "Nội dung chuyển khoản phải đúng mã đơn, mỗi dòng đều có nút sao chép. Bạn không cần chọn cách trả: trang đơn tự hiện đúng một trong hai cách dưới đây.",
    hasPaymentMethods: true,
  },
  {
    title: "Vào học",
    description:
      "Thanh toán xong, trang đơn tự chuyển bạn tới khóa vừa mua. Mọi khóa đã mua đều nằm ở Khu vực học tập.",
    link: { label: "Mở Khu vực học tập", href: "/study" },
  },
];

export const howToBuyPaymentMethods: HowToBuyPaymentMethod[] = [
  {
    icon: QrCode,
    title: "Khóa của Evonhub",
    description:
      "Quét mã QR bằng app ngân hàng, số tiền và nội dung đã điền sẵn.",
    unlockNote: "Khóa tự mở khi tiền về, thường dưới một phút",
  },
  {
    icon: UserRound,
    title: "Khóa của chuyên gia",
    description:
      "Chuyển thẳng vào tài khoản của chuyên gia, rồi gửi ảnh giao dịch kèm mã đơn qua Facebook hoặc email.",
    unlockNote: "Khóa mở khi chuyên gia duyệt, bạn nhận email báo",
  },
];

export const howToBuyTroubles: HowToBuyTrouble[] = [
  {
    title: "Chuyển thiếu tiền",
    description:
      "Đơn vẫn giữ và cộng dồn số đã nhận. Chuyển nốt phần còn thiếu với đúng nội dung là mã đơn, đơn tự duyệt khi đủ tiền.",
  },
  {
    title: "Quên ghi nội dung hoặc ghi sai mã đơn",
    description:
      "Hệ thống dựa vào mã đơn để nhận ra tiền của bạn. Nhắn Evondev kèm ảnh giao dịch và mã đơn để được kiểm tra.",
  },
  {
    title: "Đơn đã hết hạn",
    description:
      "Mã đơn quá 24 giờ không nhận tiền nữa, bấm mua lại để có mã mới. Lỡ chuyển cho chuyên gia sau hạn thì vẫn gửi ảnh giao dịch kèm mã đơn.",
  },
  {
    title: "Đã chuyển mà khóa chưa mở",
    description:
      "Khóa của Evonhub thường mở dưới một phút, khóa của chuyên gia cần chờ chuyên gia duyệt. Đợi lâu hơn thế thì nhắn Evondev kèm ảnh giao dịch.",
  },
];
