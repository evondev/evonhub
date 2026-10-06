import {
  MyOrderStatusMeta,
  OrderDetailsKind,
  OrderDetailsPreviewStateLink,
} from "../types";

/** Đơn vừa thanh toán thì đếm ngược bấy nhiêu giây rồi chuyển sang khu học tập */
export const ORDER_PAID_REDIRECT_SECONDS = 3;

export const ORDER_SUPPORT_URL = "https://fb.com/tuan.trananh.0509";

export const ORDER_SUPPORT_NAME = "Evondev";

/** Badge ở đầu trang theo màn đang hiện */
export const ORDER_DETAILS_BADGES: Record<OrderDetailsKind, MyOrderStatusMeta> =
  {
    "sepay-pending": { label: "Chờ thanh toán", tone: "warning" },
    "manual-pending": { label: "Chờ thanh toán", tone: "warning" },
    "manual-missing-payee": { label: "Chờ thanh toán", tone: "warning" },
    "free-pending": { label: "Chờ kích hoạt", tone: "warning" },
    paid: { label: "Đã thanh toán", tone: "success" },
    expired: { label: "Hết hạn", tone: "neutral" },
    "manual-expired": { label: "Hết hạn", tone: "neutral" },
    rejected: { label: "Bị từ chối", tone: "error" },
  };

export const ORDER_DETAILS_PREVIEW_STATE_LINKS: OrderDetailsPreviewStateLink[] =
  [
    { state: "cho-thanh-toan", label: "Chờ thanh toán" },
    { state: "sap-het-han", label: "Sắp hết hạn" },
    { state: "chuyen-thieu", label: "Chuyển thiếu" },
    { state: "thu-cong", label: "Khóa chuyên gia" },
    { state: "thu-cong-thieu-tai-khoan", label: "Chuyên gia thiếu tài khoản" },
    { state: "thu-cong-het-han", label: "Khóa chuyên gia hết hạn" },
    { state: "mien-phi", label: "Miễn phí chờ duyệt" },
    { state: "vua-thanh-toan", label: "Vừa thanh toán" },
    { state: "da-thanh-toan", label: "Đã thanh toán" },
    { state: "het-han", label: "Hết hạn" },
    { state: "bi-tu-choi", label: "Bị từ chối" },
    { state: "dang-tai", label: "Đang tải" },
  ];
