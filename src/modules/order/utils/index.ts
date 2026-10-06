import {
  OrderPaymentMethod,
  OrderStatus,
  PENDING_ORDER_TTL_MS,
} from "@/shared/constants/order.constants";
import {
  bankAccountInfo,
  ORDER_CODE_PATTERN,
} from "@/shared/constants/payment.constants";
import { ManualPaymentPayee } from "@/shared/types/payment.types";
import { formatThoundsand } from "@/shared/utils";
import {
  FREE_ORDER_PAID_LABEL,
  MY_ORDER_STATUS_META,
  MY_ORDERS_HISTORY_TABS,
  PENDING_ORDER_URGENT_MS,
  PREVIEW_ORDER_COURSES,
} from "../constants";
import {
  MyOrderHistoryItem,
  MyOrderItem,
  MyOrdersGroups,
  MyOrdersHistoryFilter,
  MyOrdersHistoryTab,
  MyOrdersPreviewState,
  MyOrderStatus,
  ManualPaymentPayeeSource,
  OrderItemData,
  OrderModelProps,
} from "../types";

/** Mốc thời gian mà đơn PENDING tạo trước đó bị coi là hết hạn. */
export function getPendingOrderExpiryDate(now: Date = new Date()): Date {
  return new Date(now.getTime() - PENDING_ORDER_TTL_MS);
}

export function isPendingOrderExpired(
  createdAt: Date,
  now: Date = new Date()
): boolean {
  return createdAt.getTime() <= getPendingOrderExpiryDate(now).getTime();
}

/**
 * Thời hạn còn lại của đơn PENDING, dạng chữ để ghép vào thông báo cho khách.
 * Ví dụ: "18 giờ", "45 phút".
 */
export function formatRemainingPendingTime(
  createdAt: Date,
  now: Date = new Date()
): string {
  const remainingMs =
    createdAt.getTime() + PENDING_ORDER_TTL_MS - now.getTime();

  if (remainingMs <= 0) return "";

  const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

  if (remainingMinutes < 60) return `${remainingMinutes} phút`;

  return `${Math.ceil(remainingMinutes / 60)} giờ`;
}

/**
 * Ảnh QR chuyển khoản của SePay. Nội dung chuyển khoản là mã đơn hàng nên
 * webhook đối soát được ngay khi khách quét QR trả tiền.
 */
export function getPaymentQrUrl(orderCode: string, amount: number): string {
  const params = new URLSearchParams({
    acc: bankAccountInfo.accountNumber,
    bank: bankAccountInfo.bankCode,
    amount: String(amount),
    des: orderCode,
  });

  return `https://qr.sepay.vn/img?${params.toString()}`;
}

export function isManualPaymentOrder(
  order: Pick<OrderModelProps, "paymentMethod">,
): boolean {
  return order.paymentMethod === OrderPaymentMethod.Manual;
}

/**
 * Thông tin nhận tiền của chuyên gia. Thiếu ngân hàng, số tài khoản hay chủ tài
 * khoản thì trả về undefined: khách không có chỗ để chuyển tiền.
 */
export function toManualPaymentPayee(
  author: ManualPaymentPayeeSource | null | undefined,
): ManualPaymentPayee | undefined {
  const bankName = author?.bank?.bankName?.trim();
  const bankNumber = author?.bank?.bankNumber?.trim();
  const bankAccount = author?.bank?.bankAccount?.trim();

  if (!author || !bankName || !bankNumber || !bankAccount) return;

  // Schema hồ sơ nhận cả link javascript:, chỉ giữ link web thật
  const facebook = author.socials?.facebook?.trim();
  const isWebLink = !!facebook && /^https?:\/\//i.test(facebook);

  return {
    name: author.name || author.username || "Chuyên gia",
    email: author.email || "",
    facebook: isWebLink ? facebook : undefined,
    bankName,
    bankNumber,
    bankAccount,
    bankBranch: author.bank?.bankBranch?.trim() || undefined,
  };
}

/** Tách mã đơn hàng ra khỏi nội dung chuyển khoản do ngân hàng gửi về. */
export function extractOrderCode(...contents: (string | null)[]): string {
  for (const content of contents) {
    const matched = content?.match(ORDER_CODE_PATTERN);

    if (matched) return matched[0].toUpperCase();
  }

  return "";
}

/**
 * Trạng thái đơn như học viên thấy. Đơn PENDING chỉ bị ghi EXPIRED khi khách
 * mua lại đúng khóa đó, nên đơn chờ quá 24 giờ phải tự tính là hết hạn.
 */
export function getMyOrderStatus(
  order: Pick<MyOrderItem, "status" | "createdAt">,
  now: Date = new Date(),
): MyOrderStatus {
  if (order.status === OrderStatus.Approved) return "paid";
  if (order.status === OrderStatus.Rejected) return "rejected";
  if (order.status === OrderStatus.Expired) return "expired";

  return isPendingOrderExpired(new Date(order.createdAt), now)
    ? "expired"
    : "pending";
}

/** Tách đơn còn phải thanh toán ra khỏi lịch sử; lịch sử giữ thứ tự mới nhất trước */
export function groupMyOrders(
  orders: MyOrderItem[],
  now: Date = new Date(),
): MyOrdersGroups {
  const groups: MyOrdersGroups = { pendingOrders: [], historyItems: [] };

  for (const order of orders) {
    const status = getMyOrderStatus(order, now);

    if (status === "pending") {
      groups.pendingOrders.push(order);
      continue;
    }

    groups.historyItems.push({ order, status });
  }

  // Đơn sắp hết hạn (đặt sớm nhất) lên trước
  groups.pendingOrders.sort(
    (firstOrder, secondOrder) =>
      new Date(firstOrder.createdAt).getTime() -
      new Date(secondOrder.createdAt).getTime(),
  );

  return groups;
}

export function isPendingOrderUrgent(
  createdAt: Date | string,
  now: Date = new Date(),
): boolean {
  const remainingMs =
    new Date(createdAt).getTime() + PENDING_ORDER_TTL_MS - now.getTime();

  return remainingMs <= PENDING_ORDER_URGENT_MS;
}

export function formatOrderPrice(total: number): string {
  if (total <= 0) return "Miễn phí";

  return `${formatThoundsand(total)} đ`;
}

/** Ngày, tháng, năm của một mốc theo giờ Việt Nam (server chạy giờ UTC) */
function getVietnamDateParts(date: Date): Record<string, string> {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });

  return Object.fromEntries(
    dateFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
}

/** Ngày đặt đơn dạng 05/10; đơn của năm khác thì thêm năm: 09/11/2025 */
export function formatOrderDate(
  date: Date | string,
  now: Date = new Date(),
): string {
  const orderDateParts = getVietnamDateParts(new Date(date));
  const isThisYear = orderDateParts.year === getVietnamDateParts(now).year;
  const dayMonth = `${orderDateParts.day}/${orderDateParts.month}`;

  if (isThisYear) return dayMonth;

  return `${dayMonth}/${orderDateParts.year}`;
}

export function getMyOrderBadgeLabel(historyItem: MyOrderHistoryItem): string {
  if (historyItem.status === "paid" && historyItem.order.total <= 0)
    return FREE_ORDER_PAID_LABEL;

  return MY_ORDER_STATUS_META[historyItem.status].label;
}

/** Đơn đã thanh toán thì vào học, đơn hết hạn hay bị từ chối thì mua lại */
export function getMyOrderHistoryHref(
  historyItem: MyOrderHistoryItem,
): string | undefined {
  const courseSlug = historyItem.order.course?.slug;

  if (!courseSlug) return;
  if (historyItem.status === "paid") return `/study?khoa=${courseSlug}`;

  return `/course/${courseSlug}`;
}

/** Tab lọc lịch sử: chỉ hiện trạng thái đang có đơn, kèm số đơn */
export function buildMyOrdersHistoryTabs(
  historyItems: MyOrderHistoryItem[],
): MyOrdersHistoryTab[] {
  return MY_ORDERS_HISTORY_TABS.map((tab) => ({
    ...tab,
    count: filterMyOrdersHistory(historyItems, tab.value).length,
  })).filter((tab) => tab.value === "all" || tab.count > 0);
}

export function filterMyOrdersHistory(
  historyItems: MyOrderHistoryItem[],
  filter: MyOrdersHistoryFilter,
): MyOrderHistoryItem[] {
  if (filter === "all") return historyItems;

  return historyItems.filter((historyItem) => historyItem.status === filter);
}

export function toMyOrderItem(order: OrderItemData): MyOrderItem {
  return {
    id: order._id.toString(),
    code: order.code,
    status: order.status,
    createdAt: order.createdAt,
    amount: order.amount,
    discount: order.discount,
    total: order.total,
    couponCode: order.couponCode,
    course: order.course
      ? {
          title: order.course.title,
          slug: order.course.slug,
          image: order.course.image,
        }
      : undefined,
  };
}

/**
 * Đơn giả cho trang xem trước, phủ các ca biên: đơn sắp hết hạn, đơn chờ quá
 * 24 giờ, khóa miễn phí, đơn năm ngoái, khóa không ảnh, khóa đã gỡ.
 */
export function buildPreviewMyOrders(
  state: MyOrdersPreviewState,
  now: Date = new Date(),
): MyOrderItem[] {
  if (state === "rong") return [];

  const hourMs = 60 * 60 * 1000;
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * hourMs);
  const [nextjsCourse, vibeCourse, typescriptCourse, aiCourse, securityCourse] =
    PREVIEW_ORDER_COURSES;
  const pendingOrders: MyOrderItem[] = [
    {
      id: "preview-1",
      code: "DH48213077",
      status: OrderStatus.Pending,
      createdAt: hoursAgo(1),
      amount: 990000,
      discount: 0,
      total: 990000,
      course: vibeCourse,
    },
    {
      id: "preview-2",
      code: "DH47950312",
      status: OrderStatus.Pending,
      createdAt: hoursAgo(22),
      amount: 1990000,
      discount: 400000,
      total: 1590000,
      couponCode: "EVON20",
      course: nextjsCourse,
    },
  ];
  const historyOrders: MyOrderItem[] = [
    {
      id: "preview-3",
      code: "DH47390548",
      status: OrderStatus.Approved,
      createdAt: hoursAgo(3 * 24),
      amount: 0,
      discount: 0,
      total: 0,
      course: typescriptCourse,
    },
    {
      // Còn PENDING trong DB nhưng đã quá 24 giờ: hiện là hết hạn
      id: "preview-4",
      code: "DH46120985",
      status: OrderStatus.Pending,
      createdAt: hoursAgo(9 * 24),
      amount: 790000,
      discount: 0,
      total: 790000,
      course: aiCourse,
    },
    {
      id: "preview-5",
      code: "DH44871203",
      status: OrderStatus.Rejected,
      createdAt: hoursAgo(40 * 24),
      amount: 499000,
      discount: 0,
      total: 499000,
    },
    {
      id: "preview-6",
      code: "DH31207764",
      status: OrderStatus.Approved,
      createdAt: hoursAgo(330 * 24),
      amount: 1290000,
      discount: 200000,
      total: 1090000,
      couponCode: "TET2025",
      course: securityCourse,
    },
  ];

  if (state === "khong-cho-thanh-toan") return historyOrders;

  return [...pendingOrders, ...historyOrders];
}
