import { OrderStatus } from "@/shared/constants/order.constants";
import {
  OrderManageFilters,
  OrderManagePreviewStateLink,
  OrderManageTab,
  OrderManageTabCounts,
  OrderManageTabDefinition,
} from "../types/order-manage.types";

export const ORDER_MANAGE_TAB_VALUES: OrderManageTab[] = [
  "all",
  "needs-action",
  "waiting",
  OrderStatus.Approved,
  OrderStatus.Expired,
  OrderStatus.Rejected,
];

export const ORDER_MANAGE_TABS: OrderManageTabDefinition[] = [
  { value: "all", label: "Tất cả" },
  { value: "needs-action", label: "Cần xử lý" },
  { value: "waiting", label: "Chờ thanh toán" },
  { value: OrderStatus.Approved, label: "Đã duyệt" },
  { value: OrderStatus.Expired, label: "Hết hạn" },
  { value: OrderStatus.Rejected, label: "Bị từ chối" },
];

export const ORDER_MANAGE_DEFAULT_FILTERS: OrderManageFilters = {
  tab: "all",
  search: "",
  isFree: false,
  page: 1,
};

/** Câu báo rỗng khi không tìm, không lọc, theo tab đang xem */
export const ORDER_MANAGE_EMPTY_MESSAGES: Record<OrderManageTab, string> = {
  all: "Chưa có đơn hàng nào.",
  "needs-action": "Không có đơn nào cần xử lý.",
  waiting: "Không có đơn nào đang chờ thanh toán.",
  [OrderStatus.Approved]: "Chưa có đơn nào được duyệt.",
  [OrderStatus.Expired]: "Không có đơn nào hết hạn.",
  [OrderStatus.Rejected]: "Không có đơn nào bị từ chối.",
};

export const ORDER_MANAGE_SEARCH_PLACEHOLDER = "Tìm mã đơn hoặc email";

/** Dòng phụ của đơn chờ quá PENDING_ORDER_TTL_MS mà chưa thấy tiền */
export const ORDER_MANAGE_EXPIRED_DETAIL = "Chờ quá 24 giờ";

export const ORDER_MANAGE_SKELETON_ROW_COUNT = 6;

export const ORDER_MANAGE_PREVIEW_STATE_LINKS: OrderManagePreviewStateLink[] = [
  { state: "du-lieu", label: "Có dữ liệu" },
  { state: "rong", label: "Rỗng do tìm" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

export const ORDER_MANAGE_PREVIEW_SAVE_DELAY_MS = 700;

/** Từ khoá trang xem trước dùng cho trạng thái rỗng do tìm */
export const ORDER_MANAGE_PREVIEW_EMPTY_KEYWORD = "DH99999999";

/** Trang xem trước giả như đang xem trang đầu của cả danh sách thật */
export const ORDER_MANAGE_PREVIEW_TAB_COUNTS: OrderManageTabCounts = {
  all: 1284,
  "needs-action": 6,
  waiting: 11,
  [OrderStatus.Approved]: 1163,
  [OrderStatus.Expired]: 81,
  [OrderStatus.Rejected]: 23,
};
