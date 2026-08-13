import { OrderStatus } from "@/shared/constants/order.constants";
import {
  clearCollections,
  connectMemoryDatabase,
  disconnectMemoryDatabase,
} from "@/test/setup-memory-db";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import OrderModel from "../models";
import { createPendingOrder } from "./create-pending-order.service";

const userId = new mongoose.Types.ObjectId().toString();
const courseId = new mongoose.Types.ObjectId().toString();

const orderInput = {
  userId,
  courseId,
  amount: 999_000,
  discount: 0,
  total: 999_000,
};

const HOUR_IN_MS = 60 * 60 * 1000;

async function createOrderAgedHours(hoursAgo: number) {
  const createdAt = new Date(Date.now() - hoursAgo * HOUR_IN_MS);

  return OrderModel.create({
    user: userId,
    course: courseId,
    amount: 999_000,
    total: 999_000,
    code: "DH00000001",
    status: OrderStatus.Pending,
    createdAt,
  });
}

beforeAll(async () => {
  await connectMemoryDatabase();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await disconnectMemoryDatabase();
});

describe("createPendingOrder", () => {
  it("chặn tạo đơn mới khi đang có đơn PENDING còn hiệu lực", async () => {
    const staleOrder = await createOrderAgedHours(6);

    const result = await createPendingOrder(orderInput);

    expect(result.order).toBeUndefined();
    expect(result.existingOrder?.code).toBe(staleOrder.code);
    expect(await OrderModel.countDocuments({})).toBe(1);
  });

  it("cho tạo đơn mới và cho đơn cũ hết hạn khi đơn PENDING đã quá 24 giờ", async () => {
    const expiredOrder = await createOrderAgedHours(25);

    const result = await createPendingOrder(orderInput);

    expect(result.existingOrder).toBeUndefined();
    expect(result.order?.status).toBe(OrderStatus.Pending);
    expect(result.order?.code).not.toBe(expiredOrder.code);

    const oldOrder = await OrderModel.findById(expiredOrder._id);

    // Giữ lại bản ghi, chỉ đổi trạng thái
    expect(oldOrder?.status).toBe(OrderStatus.Expired);
    expect(await OrderModel.countDocuments({})).toBe(2);
  });

  it("tạo đơn mới khi khách chưa có đơn nào", async () => {
    const result = await createPendingOrder(orderInput);

    expect(result.existingOrder).toBeUndefined();
    expect(result.order?.status).toBe(OrderStatus.Pending);
    expect(result.order?.total).toBe(999_000);
    expect(await OrderModel.countDocuments({})).toBe(1);
  });

  it("đơn PENDING của khóa học khác không bị ảnh hưởng", async () => {
    const otherCourseId = new mongoose.Types.ObjectId().toString();
    const otherOrder = await OrderModel.create({
      user: userId,
      course: otherCourseId,
      amount: 199_000,
      total: 199_000,
      code: "DH00000002",
      status: OrderStatus.Pending,
      createdAt: new Date(Date.now() - 30 * HOUR_IN_MS),
    });

    await createPendingOrder(orderInput);

    const untouched = await OrderModel.findById(otherOrder._id);

    expect(untouched?.status).toBe(OrderStatus.Pending);
  });
});
