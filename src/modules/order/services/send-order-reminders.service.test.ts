import UserModel from "@/modules/user/models";
import { OrderStatus } from "@/shared/constants/order.constants";
import {
  clearCollections,
  connectMemoryDatabase,
  disconnectMemoryDatabase,
} from "@/test/setup-memory-db";
import mongoose from "mongoose";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import OrderModel from "../models";
import { sendOrderReminders } from "./send-order-reminders.service";

const sendOrderReminderEmail = vi.fn().mockResolvedValue(true);

vi.mock("@/modules/email/services/order-email.service", () => ({
  sendOrderReminderEmail: (...args: unknown[]) =>
    sendOrderReminderEmail(...args),
}));

const HOUR_IN_MS = 60 * 60 * 1000;

let userId: string;

async function createPendingOrder(
  hoursAgo: number,
  overrides: Record<string, unknown> = {}
) {
  return OrderModel.create({
    user: userId,
    course: new mongoose.Types.ObjectId(),
    code: `DH${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
    amount: 999_000,
    total: 999_000,
    status: OrderStatus.Pending,
    createdAt: new Date(Date.now() - hoursAgo * HOUR_IN_MS),
    ...overrides,
  });
}

beforeAll(async () => {
  await connectMemoryDatabase();
});

beforeEach(async () => {
  userId = new mongoose.Types.ObjectId().toString();

  await UserModel.create({
    _id: userId,
    clerkId: "clerk_test",
    name: "Hoc Vien",
    username: "hocvien",
    email: "hocvien@example.com",
    avatar: "https://evonhub.dev/avatar.png",
  });
});

afterEach(async () => {
  await clearCollections();
  sendOrderReminderEmail.mockClear();
});

afterAll(async () => {
  await disconnectMemoryDatabase();
});

describe("sendOrderReminders", () => {
  it("nhắc đơn PENDING quá 1 giờ chưa thanh toán", async () => {
    const order = await createPendingOrder(2);

    const result = await sendOrderReminders();

    expect(result.sent).toBe(1);
    expect(sendOrderReminderEmail).toHaveBeenCalledWith(
      "hocvien@example.com",
      expect.objectContaining({ code: order.code, total: 999_000 })
    );

    const updated = await OrderModel.findById(order._id);

    expect(updated?.reminderSentAt).toBeInstanceOf(Date);
  });

  it("không nhắc lại đơn đã gửi nhắc", async () => {
    await createPendingOrder(2);

    await sendOrderReminders();
    const secondRun = await sendOrderReminders();

    expect(secondRun.sent).toBe(0);
    expect(sendOrderReminderEmail).toHaveBeenCalledTimes(1);
  });

  it("bỏ qua đơn mới tạo dưới 1 giờ", async () => {
    await createPendingOrder(0.5);

    const result = await sendOrderReminders();

    expect(result.sent).toBe(0);
    expect(sendOrderReminderEmail).not.toHaveBeenCalled();
  });

  it("bỏ qua đơn đã quá hạn 24 giờ", async () => {
    await createPendingOrder(30);

    const result = await sendOrderReminders();

    expect(result.sent).toBe(0);
  });

  it("bỏ qua đơn đã nhận được tiền", async () => {
    await createPendingOrder(2, { paidAmount: 500_000 });

    const result = await sendOrderReminders();

    expect(result.sent).toBe(0);
  });

  it("trả lại cờ để nhắc lần sau khi gửi email thất bại", async () => {
    const order = await createPendingOrder(2);

    sendOrderReminderEmail.mockResolvedValueOnce(false);

    const result = await sendOrderReminders();

    expect(result.sent).toBe(0);

    const updated = await OrderModel.findById(order._id);

    expect(updated?.reminderSentAt).toBeUndefined();
  });
});
