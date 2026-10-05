import { OrderStatus } from "@/shared/constants/order.constants";
import { BadgeTone } from "@/shared/types";

/**
 * Nhóm của một đơn trên trang quản lý. Mỗi đơn đúng một nhóm: đơn PENDING tách
 * thành cần admin xử lý (0 đồng, đã nhận tiền), đang đợi khách, và chờ quá 24
 * giờ mà chưa nhận đồng nào (vào chung nhóm hết hạn)
 */
export type OrderManageGroup =
  | "needs-action"
  | "waiting"
  | OrderStatus.Approved
  | OrderStatus.Expired
  | OrderStatus.Rejected;

export type OrderManageTab = "all" | OrderManageGroup;

export type OrderManageTabCounts = Record<OrderManageTab, number>;

export interface OrderManageTabDefinition {
  value: OrderManageTab;
  label: string;
}

export interface OrderManageFilters {
  tab: OrderManageTab;
  search: string;
  /** Chỉ xem đơn 0 đồng */
  isFree: boolean;
  page: number;
}

/** Phần dữ liệu một đơn mà trang quản lý cần */
export interface OrderManageRow {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: Date | string;
  total: number;
  discount: number;
  couponCode?: string;
  /** Tổng tiền SePay đã ghi nhận cho đơn */
  paidAmount: number;
  /** Có giao dịch SePay: đơn đủ tiền là do SePay tự duyệt */
  isPaidViaSepay: boolean;
  courseTitle?: string;
  /** Đơn gói thành viên cũ: tên gói */
  planName?: string;
  student: OrderManageStudent;
}

export interface OrderManageStudent {
  name: string;
  email: string;
}

export interface OrderManageResult {
  orders: OrderManageRow[];
  /** Số đơn khớp bộ lọc của tab đang xem, trên mọi trang */
  total: number;
  tabCounts: OrderManageTabCounts;
  /** Số đơn 0 đồng đang chờ admin duyệt; 0 thì ẩn nút duyệt đơn miễn phí */
  freePendingCount: number;
}

/** Trạng thái như admin cần thấy: tính thêm từ số tiền đã nhận và giờ tạo đơn */
export interface OrderManageStatusView {
  label: string;
  tone: BadgeTone;
  /** Dòng nhỏ dưới badge: đã nhận bao nhiêu, còn bao lâu, ai duyệt */
  detail?: string;
}

export type OrderManageAction = "approve" | "reject";

export interface OrderManagePendingAction {
  order: OrderManageRow;
  action: OrderManageAction;
}

export type OrderManagePreviewState = "du-lieu" | "rong" | "dang-tai" | "loi";

export interface OrderManagePreviewStateLink {
  state: OrderManagePreviewState;
  label: string;
}
