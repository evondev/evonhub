import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan } from "@/shared/constants/user.constants";
import { FilterTabItem } from "@/shared/types";
import { formatThoundsand } from "@/shared/utils";
import {
  formatOrderDate,
  formatRemainingPendingTime,
  isPendingOrderExpired,
} from ".";
import { PREVIEW_ORDER_COURSES } from "../constants";
import {
  ORDER_MANAGE_EXPIRED_DETAIL,
  ORDER_MANAGE_TABS,
} from "../constants/order-manage.constants";
import { OrderItemData } from "../types";
import {
  OrderManageAction,
  OrderManageFilters,
  OrderManageGroup,
  OrderManageRow,
  OrderManageStatusView,
  OrderManageTab,
  OrderManageTabCounts,
} from "../types/order-manage.types";

export function toOrderManageRow(order: OrderItemData): OrderManageRow {
  const hasPlan = Boolean(order.plan) && order.plan !== MembershipPlan.None;

  return {
    id: order._id.toString(),
    code: order.code,
    status: order.status,
    createdAt: order.createdAt,
    total: order.total,
    discount: order.discount || order.coupon?.amount || 0,
    couponCode: order.couponCode || order.coupon?.code,
    paidAmount: order.paidAmount || 0,
    isPaidViaSepay: Boolean(order.paymentReferences?.length),
    courseTitle: order.course?.title,
    planName: hasPlan ? formatPlanName(order.plan) : undefined,
    student: {
      name: order.user?.username || "",
      email: order.user?.email || "",
    },
  };
}

function formatPlanName(plan: MembershipPlan): string {
  return `Gói ${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;
}

/** Đơn còn chờ thì admin duyệt hoặc từ chối được, kể cả đơn chờ quá 24 giờ (tiền về muộn) */
export function canProcessOrder(order: OrderManageRow): boolean {
  return order.status === OrderStatus.Pending;
}

/**
 * Nhóm (tab) của một đơn, khớp buildOrderGroupCondition ở server: đơn chờ mà
 * 0 đồng hay đã nhận tiền thì cần admin xử lý; chưa nhận đồng nào thì đợi khách,
 * quá 24 giờ thì tính là hết hạn
 */
export function getOrderManageGroup(
  order: Pick<OrderManageRow, "status" | "total" | "paidAmount" | "createdAt">,
  now: Date = new Date(),
): OrderManageGroup {
  if (order.status !== OrderStatus.Pending) return order.status;
  if (order.total <= 0 || order.paidAmount > 0) return "needs-action";
  if (isPendingOrderExpired(new Date(order.createdAt), now)) {
    return OrderStatus.Expired;
  }

  return "waiting";
}

/**
 * Trạng thái như admin cần thấy. DB chỉ ghi PENDING cho mọi đơn chưa xong, nên
 * tách thêm: thiếu tiền và đơn 0 đồng (chờ admin), chờ quá 24 giờ (coi như hết
 * hạn), còn lại là đang đợi khách chuyển khoản
 */
export function getOrderManageStatusView(
  order: OrderManageRow,
  now: Date = new Date(),
): OrderManageStatusView {
  const isFree = order.total <= 0;
  const receivedDetail = `Đã nhận ${formatThoundsand(order.paidAmount)} đ`;

  if (order.status === OrderStatus.Approved) {
    return {
      label: "Đã duyệt",
      tone: "success",
      detail: getApprovedDetail(order),
    };
  }

  if (order.status === OrderStatus.Rejected) {
    return {
      label: "Bị từ chối",
      tone: "error",
      detail: order.paidAmount > 0 ? receivedDetail : undefined,
    };
  }

  if (order.status === OrderStatus.Expired) {
    return {
      label: "Hết hạn",
      tone: "neutral",
      detail: order.paidAmount > 0 ? receivedDetail : undefined,
    };
  }

  if (isFree) {
    return { label: "Chờ duyệt", tone: "warning", detail: "Đơn miễn phí" };
  }

  if (order.paidAmount > 0 && order.paidAmount < order.total) {
    return { label: "Thiếu tiền", tone: "warning", detail: receivedDetail };
  }

  if (order.paidAmount >= order.total) {
    return { label: "Chờ duyệt", tone: "warning", detail: "Đã nhận đủ tiền" };
  }

  const createdAt = new Date(order.createdAt);

  if (isPendingOrderExpired(createdAt, now)) {
    return {
      label: "Hết hạn",
      tone: "neutral",
      detail: ORDER_MANAGE_EXPIRED_DETAIL,
    };
  }

  return {
    label: "Chờ thanh toán",
    tone: "neutral",
    detail: `Còn ${formatRemainingPendingTime(createdAt, now)}`,
  };
}

function getApprovedDetail(order: OrderManageRow): string {
  if (order.total <= 0) return "Đơn miễn phí";
  if (!order.isPaidViaSepay) return "Duyệt tay";

  const overpaidAmount = order.paidAmount - order.total;

  if (overpaidAmount > 0) {
    return `SePay, dư ${formatThoundsand(overpaidAmount)} đ`;
  }

  return "SePay tự duyệt";
}

/** Giờ và ngày tạo đơn theo giờ Việt Nam: "14:32, 05/10" */
export function formatOrderManageTime(
  createdAt: Date | string,
  now: Date = new Date(),
): string {
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(createdAt));

  return `${time}, ${formatOrderDate(createdAt, now)}`;
}

export function formatOrderDiscount(discount: number): string {
  return `Giảm ${formatThoundsand(discount)} đ`;
}

export function getOrderStatusForAction(
  action: OrderManageAction,
): OrderStatus {
  return action === "approve" ? OrderStatus.Approved : OrderStatus.Rejected;
}

export function buildOrderManageTabs(
  tabCounts?: OrderManageTabCounts,
): FilterTabItem<OrderManageTab>[] {
  return ORDER_MANAGE_TABS.map((tab) => ({
    ...tab,
    count: tabCounts?.[tab.value],
  }));
}

export function buildOrderActionSuccessMessage(
  order: OrderManageRow,
  action: OrderManageAction,
): string {
  if (action === "approve") return `Đã duyệt đơn ${order.code}`;

  return `Đã từ chối đơn ${order.code}`;
}

/**
 * Đơn giả cho trang xem trước, phủ các ca biên: thiếu tiền, đủ tiền mà chưa
 * duyệt, đơn 0 đồng chờ duyệt, chờ quá 24 giờ, SePay chuyển dư, duyệt tay, gói
 * thành viên cũ, khoá đã gỡ, học viên chưa đặt tên, email và tên khoá dài
 */
export function buildPreviewManageOrders(
  now: Date = new Date(),
): OrderManageRow[] {
  const minuteMs = 60 * 1000;
  const minutesAgo = (minutes: number) =>
    new Date(now.getTime() - minutes * minuteMs);
  const [nextjsCourse, vibeCourse, typescriptCourse, aiCourse, securityCourse] =
    PREVIEW_ORDER_COURSES;
  const baseOrder = {
    discount: 0,
    paidAmount: 0,
    isPaidViaSepay: false,
  };

  return [
    {
      ...baseOrder,
      id: "preview-1",
      code: "DH48213077",
      status: OrderStatus.Pending,
      createdAt: minutesAgo(12),
      total: 990000,
      courseTitle: vibeCourse.title,
      student: {
        name: "Nguyễn Thị Phương Thảo",
        email: "phuongthao.ng@gmail.com",
      },
    },
    {
      ...baseOrder,
      id: "preview-2",
      code: "DH48197215",
      status: OrderStatus.Pending,
      createdAt: minutesAgo(95),
      total: 1290000,
      discount: 300000,
      couponCode: "SUMMER2026",
      paidAmount: 990000,
      isPaidViaSepay: true,
      courseTitle: nextjsCourse.title,
      student: { name: "Trần Minh Khang", email: "khang.tran.dev@outlook.com" },
    },
    {
      ...baseOrder,
      id: "preview-3",
      code: "DH48190544",
      status: OrderStatus.Approved,
      createdAt: minutesAgo(140),
      total: 499000,
      paidAmount: 499000,
      isPaidViaSepay: true,
      courseTitle: typescriptCourse.title,
      student: { name: "Lê Hoàng Nam", email: "hoangnam1998@gmail.com" },
    },
    {
      ...baseOrder,
      id: "preview-4",
      code: "DH48186120",
      status: OrderStatus.Pending,
      createdAt: minutesAgo(210),
      total: 0,
      discount: 499000,
      couponCode: "EVONFREE",
      courseTitle: typescriptCourse.title,
      student: {
        name: "",
        email: "minh.anh.nguyen.tran.hoc.lap.trinh@yahoo.com.vn",
      },
    },
    {
      ...baseOrder,
      id: "preview-5",
      code: "DH48170932",
      status: OrderStatus.Approved,
      createdAt: minutesAgo(380),
      total: 790000,
      paidAmount: 840000,
      isPaidViaSepay: true,
      courseTitle: aiCourse.title,
      student: { name: "Phạm Gia Bảo", email: "giabao.pham@gmail.com" },
    },
    {
      ...baseOrder,
      id: "preview-6",
      code: "DH48152218",
      status: OrderStatus.Pending,
      createdAt: minutesAgo(26 * 60),
      total: 690000,
      courseTitle: securityCourse.title,
      student: { name: "Đỗ Khánh Linh", email: "khanhlinh.do@gmail.com" },
    },
    {
      ...baseOrder,
      id: "preview-7",
      code: "DH48139906",
      status: OrderStatus.Pending,
      createdAt: minutesAgo(30 * 60),
      total: 1290000,
      paidAmount: 1290000,
      isPaidViaSepay: true,
      courseTitle: nextjsCourse.title,
      student: { name: "Võ Thanh Tùng", email: "tungvo.it@gmail.com" },
    },
    {
      ...baseOrder,
      id: "preview-8",
      code: "DH48120457",
      status: OrderStatus.Approved,
      createdAt: minutesAgo(2 * 24 * 60),
      total: 990000,
      courseTitle: vibeCourse.title,
      student: { name: "Huỳnh Ngọc Trâm", email: "ngoctram.huynh@gmail.com" },
    },
    {
      ...baseOrder,
      id: "preview-9",
      code: "DH48098731",
      status: OrderStatus.Rejected,
      createdAt: minutesAgo(3 * 24 * 60),
      total: 1290000,
      paidAmount: 200000,
      isPaidViaSepay: true,
      courseTitle: nextjsCourse.title,
      student: { name: "Bùi Quốc Việt", email: "quocviet.bui@gmail.com" },
    },
    {
      ...baseOrder,
      id: "preview-10",
      code: "DH47950312",
      status: OrderStatus.Expired,
      createdAt: minutesAgo(9 * 24 * 60),
      total: 499000,
      student: { name: "Ngô Bảo Châu", email: "baochau.ngo@gmail.com" },
    },
    {
      ...baseOrder,
      id: "preview-11",
      code: "DH31207745",
      status: OrderStatus.Approved,
      createdAt: new Date("2025-11-09T08:15:00+07:00"),
      total: 2490000,
      planName: formatPlanName(MembershipPlan.Premium),
      student: { name: "Trương Mỹ Lan", email: "mylan.truong@gmail.com" },
    },
  ];
}

export function isPreviewOrderInTab(
  order: OrderManageRow,
  tab: OrderManageTab,
  now: Date,
): boolean {
  return tab === "all" || getOrderManageGroup(order, now) === tab;
}

/** Lọc đơn giả như server: từ khoá trong mã đơn hoặc email, đơn 0 đồng */
export function isPreviewOrderMatching(
  order: OrderManageRow,
  filters: Pick<OrderManageFilters, "search" | "isFree">,
): boolean {
  const keyword = filters.search.trim().toLowerCase();
  const isKeywordMatched =
    !keyword ||
    order.code.toLowerCase().includes(keyword) ||
    order.student.email.toLowerCase().includes(keyword);

  return isKeywordMatched && (!filters.isFree || order.total <= 0);
}

export function countPreviewOrderTabs(
  orders: OrderManageRow[],
  filters: Pick<OrderManageFilters, "search" | "isFree">,
  now: Date,
): OrderManageTabCounts {
  const matchedOrders = orders.filter((order) =>
    isPreviewOrderMatching(order, filters),
  );

  return Object.fromEntries(
    ORDER_MANAGE_TABS.map((tab) => [
      tab.value,
      matchedOrders.filter((order) =>
        isPreviewOrderInTab(order, tab.value, now),
      ).length,
    ]),
  ) as OrderManageTabCounts;
}
