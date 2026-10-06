import {
  OrderPaymentMethod,
  OrderStatus,
  PENDING_ORDER_TTL_MS,
} from "@/shared/constants/order.constants";
import { bankAccountInfo } from "@/shared/constants/payment.constants";
import { ManualPaymentPayee } from "@/shared/types/payment.types";
import { PREVIEW_ORDER_COURSES } from "../constants";
import {
  OrderDetailsData,
  OrderDetailsKind,
  OrderDetailsPreview,
  OrderDetailsPreviewState,
  TransferDetailRow,
} from "../types";
import {
  formatOrderDate,
  formatOrderPrice,
  isManualPaymentOrder,
  isPendingOrderExpired,
} from "./index";

const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

/**
 * Màn nào của trang chi tiết đơn. Đơn chờ quá 24 giờ tính là hết hạn, khớp
 * "Đơn hàng của tôi" và trang quản lý đơn. Đơn chuyển khoản thủ công hết hạn có
 * màn riêng: khách lỡ chuyển muộn vẫn gửi biên lai được, chuyên gia vẫn duyệt
 * được đơn chưa bị từ chối.
 */
export function getOrderDetailsKind(
  order: OrderDetailsData,
  now: Date = new Date(),
): OrderDetailsKind {
  if (order.status === OrderStatus.Approved) return "paid";
  if (order.status === OrderStatus.Rejected) return "rejected";
  if (order.total <= 0 && order.status === OrderStatus.Pending) {
    return "free-pending";
  }

  const isManualPayment = isManualPaymentOrder(order);
  const isExpired =
    order.status === OrderStatus.Expired ||
    isPendingOrderExpired(new Date(order.createdAt), now);

  if (isExpired) return isManualPayment ? "manual-expired" : "expired";

  if (isManualPayment) {
    return order.payee ? "manual-pending" : "manual-missing-payee";
  }

  return "sepay-pending";
}

/** Đơn còn đợi tiền về hay đợi duyệt: trang phải hỏi lại trạng thái */
export function isOrderAwaitingApproval(kind: OrderDetailsKind): boolean {
  return (
    kind === "sepay-pending" ||
    kind === "manual-pending" ||
    kind === "free-pending"
  );
}

/** Số tiền khách còn phải chuyển, trừ phần SePay đã nhận */
export function getOrderAmountDue(order: OrderDetailsData): number {
  return Math.max(order.total - order.paidAmount, 0);
}

export function isOrderPartiallyPaid(order: OrderDetailsData): boolean {
  return order.paidAmount > 0 && order.paidAmount < order.total;
}

/** "14:20" theo giờ Việt Nam (server chạy giờ UTC) */
function formatVietnamTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: VIETNAM_TIME_ZONE,
  }).format(date);
}

/** "14:20, 06/10/2026": mốc đứng riêng thì ghi đủ năm */
export function formatOrderDateTime(date: Date | string): string {
  const parsedDate = new Date(date);
  const fullDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: VIETNAM_TIME_ZONE,
  }).format(parsedDate);

  return `${formatVietnamTime(parsedDate)}, ${fullDate}`;
}

/** "trước 14:20 ngày 07/10": hạn chót của đơn đang chờ */
export function formatPendingOrderDeadline(
  createdAt: Date | string,
  now: Date = new Date(),
): string {
  const deadline = new Date(new Date(createdAt).getTime() + PENDING_ORDER_TTL_MS);

  return `trước ${formatVietnamTime(deadline)} ngày ${formatOrderDate(deadline, now)}`;
}

/** Đơn đã thanh toán thì vào thẳng khóa của đơn trong khu học tập */
export function getOrderStudyHref(order: OrderDetailsData): string {
  if (!order.course?.slug) return "/study";

  return `/study?khoa=${order.course.slug}`;
}

/** Câu dưới "Đơn đã thanh toán": giờ trả tiền, đơn vừa trả thì bỏ câu thừa */
export function getOrderPaidDescription(
  order: OrderDetailsData,
  isJustPaid?: boolean,
): string {
  if (order.total <= 0) return "Khóa miễn phí đã mở, bạn vào học được ngay.";
  if (!order.paidAt) return "Bạn đã có quyền học khóa này.";

  const paidAtText = `Thanh toán lúc ${formatOrderDateTime(order.paidAt)}.`;

  if (isJustPaid) return paidAtText;

  return `${paidAtText} Bạn đã có quyền học khóa này.`;
}

/** Thông tin chuyển khoản vào tài khoản SePay, theo thứ tự nhập trong app ngân hàng */
export function buildSepayTransferRows(
  order: OrderDetailsData,
): TransferDetailRow[] {
  const amountDue = getOrderAmountDue(order);

  return [
    { label: "Ngân hàng", value: bankAccountInfo.bankCode },
    {
      label: "Số tài khoản",
      value: bankAccountInfo.accountNumber,
      copyValue: bankAccountInfo.accountNumber,
      isMono: true,
    },
    { label: "Chủ tài khoản", value: bankAccountInfo.accountName },
    {
      label: isOrderPartiallyPaid(order) ? "Số tiền còn thiếu" : "Số tiền",
      value: formatOrderPrice(amountDue),
      copyValue: String(amountDue),
      isEmphasized: true,
    },
    {
      label: "Nội dung chuyển khoản",
      value: order.code,
      copyValue: order.code,
      isMono: true,
      isEmphasized: true,
      hint: "Ghi đúng mã này, đơn tự duyệt khi tiền về",
    },
  ];
}

/** Thông tin chuyển khoản thẳng vào tài khoản của chuyên gia */
export function buildManualTransferRows(
  order: OrderDetailsData,
  payee: ManualPaymentPayee,
): TransferDetailRow[] {
  const bankRows: TransferDetailRow[] = [
    { label: "Ngân hàng", value: payee.bankName },
  ];

  if (payee.bankBranch) {
    bankRows.push({ label: "Chi nhánh", value: payee.bankBranch });
  }

  return [
    ...bankRows,
    {
      label: "Số tài khoản",
      value: payee.bankNumber,
      copyValue: payee.bankNumber,
      isMono: true,
    },
    { label: "Chủ tài khoản", value: payee.bankAccount },
    {
      label: "Số tiền",
      value: formatOrderPrice(order.total),
      copyValue: String(order.total),
      isEmphasized: true,
    },
    {
      label: "Nội dung chuyển khoản",
      value: order.code,
      copyValue: order.code,
      isMono: true,
      isEmphasized: true,
      hint: "Ghi đúng mã này để chuyên gia đối chiếu",
    },
  ];
}

/**
 * Đơn giả cho trang xem trước, mỗi trạng thái một đơn. Phủ ca biên: tên khóa
 * hai dòng, khóa không ảnh, mã giảm giá, chuyển thiếu, chuyên gia có chi nhánh.
 */
export function buildPreviewOrderDetails(
  state: OrderDetailsPreviewState,
  now: Date = new Date(),
): OrderDetailsPreview | undefined {
  if (state === "dang-tai") return;

  const hourMs = 60 * 60 * 1000;
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * hourMs);
  const [nextjsCourse, vibeCourse, typescriptCourse, aiCourse, securityCourse] =
    PREVIEW_ORDER_COURSES;
  const pendingOrder: OrderDetailsData = {
    code: "DH27983685",
    status: OrderStatus.Pending,
    createdAt: hoursAgo(1),
    amount: 1990000,
    discount: 400000,
    total: 1590000,
    couponCode: "EVON20",
    paidAmount: 0,
    paymentMethod: OrderPaymentMethod.Sepay,
    course: nextjsCourse,
  };
  const manualOrder: OrderDetailsData = {
    ...pendingOrder,
    code: "DH28014472",
    createdAt: hoursAgo(2),
    amount: 790000,
    discount: 0,
    total: 790000,
    couponCode: undefined,
    paymentMethod: OrderPaymentMethod.Manual,
    payee: {
      name: "Nguyễn Hoàng Minh Khang",
      email: "minhkhang.nguyen.dev@evondev-studio.com",
      facebook: "https://fb.com/minhkhang.dev",
      bankName: "Vietcombank",
      bankNumber: "1029384756",
      bankAccount: "NGUYEN HOANG MINH KHANG",
      bankBranch: "Tân Bình, TP.HCM",
    },
    course: aiCourse,
  };
  const previewOrders: Record<
    Exclude<OrderDetailsPreviewState, "dang-tai">,
    OrderDetailsData
  > = {
    "cho-thanh-toan": pendingOrder,
    "sap-het-han": { ...pendingOrder, createdAt: hoursAgo(22.5) },
    "chuyen-thieu": { ...pendingOrder, paidAmount: 1000000 },
    "thu-cong": manualOrder,
    "thu-cong-thieu-tai-khoan": { ...manualOrder, payee: undefined },
    "thu-cong-het-han": { ...manualOrder, createdAt: hoursAgo(30) },
    "mien-phi": {
      ...pendingOrder,
      code: "DH27990318",
      amount: 0,
      discount: 0,
      total: 0,
      couponCode: undefined,
      course: typescriptCourse,
    },
    "vua-thanh-toan": {
      ...pendingOrder,
      status: OrderStatus.Approved,
      paidAmount: pendingOrder.total,
      paidAt: now,
    },
    "da-thanh-toan": {
      ...pendingOrder,
      code: "DH25530917",
      status: OrderStatus.Approved,
      createdAt: hoursAgo(9 * 24),
      amount: 990000,
      discount: 0,
      total: 990000,
      couponCode: undefined,
      paidAmount: 990000,
      paidAt: hoursAgo(9 * 24 - 0.2),
      course: vibeCourse,
    },
    "het-han": {
      ...pendingOrder,
      code: "DH26118250",
      createdAt: hoursAgo(3 * 24),
      course: securityCourse,
      amount: 1290000,
      discount: 0,
      total: 1290000,
      couponCode: undefined,
    },
    "bi-tu-choi": {
      ...pendingOrder,
      code: "DH24407761",
      status: OrderStatus.Rejected,
      createdAt: hoursAgo(12 * 24),
      course: undefined,
    },
  };

  return {
    order: previewOrders[state],
    isJustPaid: state === "vua-thanh-toan",
  };
}
