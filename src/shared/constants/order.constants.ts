export enum OrderStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
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
};
