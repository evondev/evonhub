import {
  OrderPaymentMethod,
  OrderStatus,
} from "@/shared/constants/order.constants";
import { describe, expect, it } from "vitest";
import { OrderDetailsData } from "../types";
import { getOrderDetailsKind } from "./order-details.utils";

const HOUR_IN_MS = 60 * 60 * 1000;
const now = new Date("2026-10-06T12:00:00.000Z");

const payee = {
  name: "Nguyễn Văn Chuyên Gia",
  email: "chuyengia@example.com",
  bankName: "Vietcombank",
  bankNumber: "1029384756",
  bankAccount: "NGUYEN VAN CHUYEN GIA",
};

function buildOrder(
  overrides: Partial<OrderDetailsData> = {},
): OrderDetailsData {
  return {
    code: "DH12345678",
    status: OrderStatus.Pending,
    createdAt: new Date(now.getTime() - 2 * HOUR_IN_MS),
    amount: 999000,
    discount: 0,
    total: 999000,
    paidAmount: 0,
    paymentMethod: OrderPaymentMethod.Sepay,
    ...overrides,
  };
}

function buildManualOrder(overrides: Partial<OrderDetailsData> = {}) {
  return buildOrder({
    paymentMethod: OrderPaymentMethod.Manual,
    payee,
    ...overrides,
  });
}

describe("getOrderDetailsKind", () => {
  it("đơn SePay còn hạn chờ thanh toán", () => {
    expect(getOrderDetailsKind(buildOrder(), now)).toBe("sepay-pending");
  });

  it("đơn cũ không có paymentMethod tính là đơn SePay", () => {
    const order = buildOrder({ paymentMethod: undefined });

    expect(getOrderDetailsKind(order, now)).toBe("sepay-pending");
  });

  it("đơn SePay quá 24 giờ là hết hạn", () => {
    const order = buildOrder({
      createdAt: new Date(now.getTime() - 25 * HOUR_IN_MS),
    });

    expect(getOrderDetailsKind(order, now)).toBe("expired");
  });

  it("đơn chuyển khoản thủ công còn hạn hiện tài khoản chuyên gia", () => {
    expect(getOrderDetailsKind(buildManualOrder(), now)).toBe("manual-pending");
  });

  it("đơn thủ công mà chuyên gia đã gỡ ngân hàng thì không hiện tài khoản", () => {
    const order = buildManualOrder({ payee: undefined });

    expect(getOrderDetailsKind(order, now)).toBe("manual-missing-payee");
  });

  it("đơn thủ công quá 24 giờ là hết hạn, có màn riêng", () => {
    const order = buildManualOrder({
      createdAt: new Date(now.getTime() - 25 * HOUR_IN_MS),
    });

    expect(getOrderDetailsKind(order, now)).toBe("manual-expired");
  });

  it("đơn thủ công đã ghi EXPIRED (khách đặt lại) vẫn là màn hết hạn thủ công", () => {
    const order = buildManualOrder({ status: OrderStatus.Expired });

    expect(getOrderDetailsKind(order, now)).toBe("manual-expired");
  });

  it("đơn 0 đồng đang chờ là chờ kích hoạt, kể cả quá 24 giờ", () => {
    const order = buildOrder({
      total: 0,
      createdAt: new Date(now.getTime() - 30 * HOUR_IN_MS),
    });

    expect(getOrderDetailsKind(order, now)).toBe("free-pending");
  });

  it("đơn đã duyệt hay bị từ chối giữ đúng trạng thái", () => {
    expect(
      getOrderDetailsKind(
        buildManualOrder({ status: OrderStatus.Approved }),
        now,
      ),
    ).toBe("paid");
    expect(
      getOrderDetailsKind(buildOrder({ status: OrderStatus.Rejected }), now),
    ).toBe("rejected");
  });
});
