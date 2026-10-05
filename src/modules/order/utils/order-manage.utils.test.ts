import { OrderStatus } from "@/shared/constants/order.constants";
import { describe, expect, it } from "vitest";
import { getOrderManageGroup } from "./order-manage.utils";

const HOUR_IN_MS = 60 * 60 * 1000;
const now = new Date("2026-10-05T12:00:00.000Z");

function buildOrder(
  overrides: Partial<Parameters<typeof getOrderManageGroup>[0]> = {},
) {
  return {
    status: OrderStatus.Pending,
    total: 499000,
    paidAmount: 0,
    createdAt: new Date(now.getTime() - 2 * HOUR_IN_MS),
    ...overrides,
  };
}

describe("getOrderManageGroup", () => {
  it("đơn chờ chưa nhận đồng nào, chưa quá 24 giờ là đang đợi khách", () => {
    expect(getOrderManageGroup(buildOrder(), now)).toBe("waiting");
  });

  it("đơn chờ chưa nhận đồng nào, quá 24 giờ là hết hạn", () => {
    const order = buildOrder({
      createdAt: new Date(now.getTime() - 25 * HOUR_IN_MS),
    });

    expect(getOrderManageGroup(order, now)).toBe(OrderStatus.Expired);
  });

  it("đơn chờ đã nhận một phần tiền cần xử lý, kể cả khi quá 24 giờ", () => {
    const order = buildOrder({
      paidAmount: 200000,
      createdAt: new Date(now.getTime() - 30 * HOUR_IN_MS),
    });

    expect(getOrderManageGroup(order, now)).toBe("needs-action");
  });

  it("đơn 0 đồng đang chờ cần xử lý", () => {
    expect(getOrderManageGroup(buildOrder({ total: 0 }), now)).toBe(
      "needs-action",
    );
  });

  it("đơn đã duyệt, bị từ chối, đã ghi hết hạn giữ đúng trạng thái DB", () => {
    for (const status of [
      OrderStatus.Approved,
      OrderStatus.Rejected,
      OrderStatus.Expired,
    ]) {
      expect(getOrderManageGroup(buildOrder({ status }), now)).toBe(status);
    }
  });
});
