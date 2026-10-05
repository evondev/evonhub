import {
  MyOrderCourse,
  MyOrdersHistoryTabDefinition,
  MyOrdersPreviewStateLink,
  MyOrderStatus,
  MyOrderStatusMeta,
} from "../types";

/** Đơn chờ còn dưới 3 giờ là sắp hết hạn: dòng thời gian chuyển hổ phách */
export const PENDING_ORDER_URGENT_MS = 3 * 60 * 60 * 1000;

export const MY_ORDER_STATUS_META: Record<MyOrderStatus, MyOrderStatusMeta> = {
  pending: { label: "Chờ thanh toán", tone: "warning" },
  paid: { label: "Đã thanh toán", tone: "success" },
  expired: { label: "Hết hạn", tone: "neutral" },
  rejected: { label: "Bị từ chối", tone: "error" },
};

/** Đơn khóa miễn phí không có tiền để "thanh toán" */
export const FREE_ORDER_PAID_LABEL = "Đã kích hoạt";

export const MY_ORDERS_HISTORY_TABS: MyOrdersHistoryTabDefinition[] = [
  { value: "all", label: "Tất cả" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "expired", label: "Hết hạn" },
  { value: "rejected", label: "Bị từ chối" },
];

export const MY_ORDERS_SKELETON_ROW_COUNT = 3;

export const MY_ORDERS_PREVIEW_STATE_LINKS: MyOrdersPreviewStateLink[] = [
  { state: "du-lieu", label: "Có đơn chờ" },
  { state: "khong-cho-thanh-toan", label: "Không có đơn chờ" },
  { state: "rong", label: "Chưa có đơn" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

const unsplashImage = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?w=800&q=80&auto=format&fit=crop`;

/** Khóa giả cho trang xem trước, ảnh giống trang Khóa học xem trước */
export const PREVIEW_ORDER_COURSES: MyOrderCourse[] = [
  {
    slug: "preview-nextjs-pro",
    title: "Khóa học NextJS Pro - Xây dựng E Learning System hoàn chỉnh",
    image: "https://utfs.io/f/97868c0d-8a10-431e-a2d4-ca1be2436392-hcfblw.png",
  },
  {
    slug: "preview-vibe-coding",
    title: "Vibe coding: dựng một app thật từ ý tưởng tới lúc có người dùng",
    image: unsplashImage("1555066931-4365d14bab8c"),
  },
  {
    slug: "preview-typescript-co-ban",
    title: "Khóa học Typescript cơ bản dành cho người mới",
    image: "https://utfs.io/f/c441d98a-8b32-49a2-8f4d-a37be5eedb15-o4mqd1.jpg",
  },
  {
    slug: "preview-ai-cho-nguoi-moi",
    title: "AI cho người mới: dùng ChatGPT, Claude để học code nhanh hơn",
    image: unsplashImage("1498050108023-c5249f4df085"),
  },
  {
    slug: "preview-bao-mat-web",
    title: "Bảo mật web cho dev dùng AI",
  },
];
