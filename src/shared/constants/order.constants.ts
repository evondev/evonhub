/** Đơn PENDING chỉ giữ chỗ trong 24 giờ, sau đó hết hạn để khách mua lại được. */
export const PENDING_ORDER_TTL_MS = 24 * 60 * 60 * 1000;

export enum OrderStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Expired = "EXPIRED",
}
export const orderStatuses: Record<
  OrderStatus,
  {
    text: string;
    className: string;
  }
> = {
  [OrderStatus.Approved]: {
    text: "Đã duyệt",
    className: "bg-green-500 text-green-500",
  },
  [OrderStatus.Pending]: {
    text: "Chờ duyệt",
    className: "bg-orange-500 text-orange-500",
  },
  [OrderStatus.Rejected]: {
    text: "Bị từ chối",
    className: "bg-red-500 text-red-500",
  },
  [OrderStatus.Expired]: {
    text: "Hết hạn",
    className: "bg-gray-500 text-gray-500",
  },
};
