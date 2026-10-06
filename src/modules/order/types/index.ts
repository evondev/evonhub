import { CouponItemData } from "@/modules/coupon/types";
import { CourseItemData } from "@/modules/course/types";
import {
  OrderPaymentMethod,
  OrderStatus,
} from "@/shared/constants/order.constants";
import { MembershipPlan, UserRole } from "@/shared/constants/user.constants";
import type { BadgeTone } from "@/shared/types";
import { ManualPaymentPayee } from "@/shared/types/payment.types";
import { UserItemData, UserModelProps } from "@/shared/types/user.types";
import { Schema } from "mongoose";
import { OrderManageTab, OrderManageTabCounts } from "./order-manage.types";

export interface OrderModelProps extends Document {
  _id: string;
  code: string;
  user: Schema.Types.ObjectId;
  course?: Schema.Types.ObjectId;
  createdAt: Date;
  status: OrderStatus;
  amount: number;
  discount: number;
  total: number;
  coupon: Schema.Types.ObjectId;
  couponCode: string;
  plan: MembershipPlan;
  _destroy: boolean;
  paymentMethod?: OrderPaymentMethod;
  paidAmount?: number;
  paidAt?: Date;
  paymentReferences?: string[];
  paymentNote?: string;
  reminderSentAt?: Date;
}

/** Phần hồ sơ chuyên gia cần để dựng thông tin nhận tiền */
export interface ManualPaymentPayeeSource {
  name?: string;
  username?: string;
  email?: string;
  socials?: Partial<UserModelProps["socials"]>;
  bank?: Partial<UserModelProps["bank"]>;
}

export interface SendOrderRemindersResult {
  candidates: number;
  sent: number;
}

export interface SettlePaymentResult {
  handled: boolean;
  message: string;
  isApproved?: boolean;
}

export interface SepayWebhookPayload {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string | null;
  content: string;
  transferType: "in" | "out";
  transferAmount: number;
  accumulated: number;
  subAccount: string | null;
  referenceCode: string;
  description: string;
}
export interface OrderItemData
  extends Omit<OrderModelProps, "user" | "course" | "coupon"> {
  user: UserItemData;
  course?: CourseItemData;
  coupon?: CouponItemData;
}

export interface FetchOrdersProps {
  limit: number;
  filter?: string;
  page: number;
  isFree?: boolean;
  /** Tab trên trang quản lý đơn; bỏ trống là mọi đơn */
  tab?: OrderManageTab;
}

export interface FetchOrdersResult {
  orders: OrderItemData[];
  /** Số đơn khớp bộ lọc của tab đang xem, trên mọi trang */
  total: number;
  tabCounts: OrderManageTabCounts;
  /** Số đơn 0 đồng đang chờ, đúng phạm vi nút "Duyệt đơn miễn phí"; chỉ admin */
  freePendingCount: number;
}

export interface CreatePendingOrderInput {
  userId: string;
  courseId: string;
  amount: number;
  discount: number;
  total: number;
  couponCode?: string;
  couponId?: string;
  paymentMethod: OrderPaymentMethod;
}

export interface CreatePendingOrderResult {
  order?: OrderModelProps;
  existingOrder?: OrderModelProps;
}

export interface FetchOrderStatusProps {
  code: string;
}

export interface UpdateOrderProps {
  code: string;
  status: OrderStatus;
}

/** Trạng thái đơn như học viên thấy: đơn chờ quá 24 giờ tính là hết hạn */
export type MyOrderStatus = "pending" | "paid" | "expired" | "rejected";

export type MyOrdersHistoryFilter = "all" | "paid" | "expired" | "rejected";

export type MyOrdersPreviewState =
  "du-lieu" | "khong-cho-thanh-toan" | "rong" | "dang-tai" | "loi";

export interface MyOrderCourse {
  title: string;
  slug: string;
  image?: string;
}

/** Phần dữ liệu đơn mà trang "Đơn hàng của tôi" cần */
export interface MyOrderItem {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: Date | string;
  amount: number;
  discount: number;
  total: number;
  couponCode?: string;
  course?: MyOrderCourse;
}

export interface MyOrderHistoryItem {
  order: MyOrderItem;
  status: Exclude<MyOrderStatus, "pending">;
}

export interface MyOrdersGroups {
  pendingOrders: MyOrderItem[];
  historyItems: MyOrderHistoryItem[];
}

export interface MyOrderStatusMeta {
  label: string;
  tone: BadgeTone;
}

export interface MyOrdersHistoryTab {
  value: MyOrdersHistoryFilter;
  label: string;
  count: number;
}

export interface MyOrdersHistoryTabDefinition {
  value: MyOrdersHistoryFilter;
  label: string;
}

export interface MyOrdersPreviewStateLink {
  state: MyOrdersPreviewState;
  label: string;
}

/** Phần dữ liệu đơn mà trang chi tiết đơn hàng cần */
export interface OrderDetailsData {
  code: string;
  status: OrderStatus;
  createdAt: Date | string;
  amount: number;
  discount: number;
  total: number;
  couponCode?: string;
  /** Tiền SePay đã nhận, cộng dồn nếu khách chuyển nhiều lần */
  paidAmount: number;
  paidAt?: Date | string;
  /** Đơn cũ không có trường này là đơn SePay */
  paymentMethod?: OrderPaymentMethod;
  /** Tài khoản nhận tiền của chuyên gia, chỉ có ở đơn chuyển khoản thủ công */
  payee?: ManualPaymentPayee;
  course?: MyOrderCourse;
}

export type OrderDetailsPreviewState =
  | "cho-thanh-toan"
  | "sap-het-han"
  | "chuyen-thieu"
  | "vua-thanh-toan"
  | "da-thanh-toan"
  | "het-han"
  | "bi-tu-choi"
  | "mien-phi"
  | "thu-cong"
  | "thu-cong-thieu-tai-khoan"
  | "thu-cong-het-han"
  | "dang-tai";

export interface OrderDetailsPreviewStateLink {
  state: OrderDetailsPreviewState;
  label: string;
}

export interface OrderDetailsPreview {
  order: OrderDetailsData;
  isJustPaid: boolean;
}

/** Màn trang chi tiết đơn đang hiện, suy từ trạng thái, cách trả tiền và giờ */
export type OrderDetailsKind =
  | "sepay-pending"
  | "manual-pending"
  | "manual-missing-payee"
  | "manual-expired"
  | "free-pending"
  | "paid"
  | "expired"
  | "rejected";

/** Một dòng thông tin chuyển khoản, xếp theo thứ tự khách nhập vào app ngân hàng */
export interface TransferDetailRow {
  label: string;
  value: string;
  /** Có thì dòng có nút sao chép, chép đúng chuỗi này (số tiền chép số trơn) */
  copyValue?: string;
  isMono?: boolean;
  isEmphasized?: boolean;
  hint?: string;
}
