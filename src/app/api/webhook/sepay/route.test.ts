import CourseModel from "@/modules/course/models";
import OrderModel from "@/modules/order/models";
import UserModel from "@/modules/user/models";
import { OrderStatus } from "@/shared/constants/order.constants";
import {
  clearCollections,
  connectMemoryDatabase,
  disconnectMemoryDatabase,
} from "@/test/setup-memory-db";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { POST } from "./route";
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

vi.mock("@/shared/libs", () => ({
  connectToDatabase: vi.fn(),
}));

const sendOrderApprovedEmail = vi.fn().mockResolvedValue(true);

vi.mock("@/modules/email/services/order-email.service", () => ({
  sendOrderApprovedEmail: (...args: unknown[]) =>
    sendOrderApprovedEmail(...args),
}));

const API_KEY = "sepay-test-key";
const ORDER_CODE = "DH12345678";
const ORDER_TOTAL = 999_000;

let userId: string;
let courseId: string;

function buildRequest(
  payload: Record<string, unknown>,
  apiKey: string | null = API_KEY
) {
  const headers = new Headers({ "content-type": "application/json" });

  if (apiKey) headers.set("authorization", `Apikey ${apiKey}`);

  return new NextRequest("https://evonhub.dev/api/webhook/sepay", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

function buildPayload(overrides: Record<string, unknown> = {}) {
  return {
    id: 92704,
    gateway: "ACB",
    transactionDate: "2026-08-13 14:02:37",
    accountNumber: "33366668888",
    code: null,
    content: `CT DEN ${ORDER_CODE}`,
    transferType: "in",
    transferAmount: ORDER_TOTAL,
    accumulated: 0,
    subAccount: null,
    referenceCode: "MBVCB.3278907687",
    description: "",
    ...overrides,
  };
}

beforeAll(async () => {
  process.env.SEPAY_API_KEY = API_KEY;
  await connectMemoryDatabase();
});

beforeEach(async () => {
  userId = new mongoose.Types.ObjectId().toString();
  courseId = new mongoose.Types.ObjectId().toString();

  await UserModel.create({
    _id: userId,
    clerkId: "clerk_test",
    name: "Hoc Vien",
    username: "hocvien",
    email: "hocvien@example.com",
    avatar: "https://evonhub.dev/avatar.png",
    courses: [],
  });
  await CourseModel.create({
    _id: courseId,
    title: "Khóa học NextJS Pro",
    slug: "khoa-hoc-nextjs-pro",
    price: ORDER_TOTAL,
  });
  await OrderModel.create({
    user: userId,
    course: courseId,
    code: ORDER_CODE,
    amount: ORDER_TOTAL,
    total: ORDER_TOTAL,
    status: OrderStatus.Pending,
  });
});

afterEach(async () => {
  await clearCollections();
  sendOrderApprovedEmail.mockClear();
});

afterAll(async () => {
  await disconnectMemoryDatabase();
});

describe("POST /api/webhook/sepay", () => {
  it("từ chối khi sai API key và không đụng vào đơn hàng", async () => {
    const response = await POST(buildRequest(buildPayload(), "sai-key"));

    expect(response.status).toBe(401);

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.status).toBe(OrderStatus.Pending);
    expect(order?.paidAmount).toBe(0);
  });

  it("từ chối khi không gửi API key", async () => {
    const response = await POST(buildRequest(buildPayload(), null));

    expect(response.status).toBe(401);
  });

  it("duyệt đơn, cấp khóa học và gửi email khi số tiền khớp", async () => {
    const response = await POST(buildRequest(buildPayload()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true });

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.status).toBe(OrderStatus.Approved);
    expect(order?.paidAmount).toBe(ORDER_TOTAL);

    const user = await UserModel.findById(userId);

    expect(user?.courses.map(String)).toContain(courseId);
    expect(sendOrderApprovedEmail).toHaveBeenCalledWith(
      "hocvien@example.com",
      expect.objectContaining({ code: ORDER_CODE, total: ORDER_TOTAL })
    );
  });

  it("không cộng tiền hai lần khi SePay gọi lại cùng một giao dịch", async () => {
    await POST(buildRequest(buildPayload()));
    const response = await POST(buildRequest(buildPayload()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true });

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.paidAmount).toBe(ORDER_TOTAL);
    expect(order?.paymentReferences).toHaveLength(1);
    expect(sendOrderApprovedEmail).toHaveBeenCalledTimes(1);
  });

  it("giữ PENDING khi khách chuyển thiếu tiền", async () => {
    const response = await POST(
      buildRequest(buildPayload({ transferAmount: 500_000 }))
    );

    expect(response.status).toBe(200);

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.status).toBe(OrderStatus.Pending);
    expect(order?.paidAmount).toBe(500_000);
    expect(order?.paymentNote).toContain("thiếu");

    const user = await UserModel.findById(userId);

    expect(user?.courses).toHaveLength(0);
    expect(sendOrderApprovedEmail).not.toHaveBeenCalled();
  });

  it("cộng dồn hai lần chuyển thiếu rồi duyệt khi đủ tiền", async () => {
    await POST(buildRequest(buildPayload({ id: 1, transferAmount: 500_000 })));
    await POST(buildRequest(buildPayload({ id: 2, transferAmount: 499_000 })));

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.status).toBe(OrderStatus.Approved);
    expect(order?.paidAmount).toBe(ORDER_TOTAL);
  });

  it("vẫn duyệt và ghi log khi khách chuyển dư tiền", async () => {
    const response = await POST(
      buildRequest(buildPayload({ transferAmount: 1_200_000 }))
    );

    expect(response.status).toBe(200);

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.status).toBe(OrderStatus.Approved);
    expect(order?.paymentNote).toContain("dư");

    const user = await UserModel.findById(userId);

    expect(user?.courses.map(String)).toContain(courseId);
  });

  it("bỏ qua giao dịch tiền ra", async () => {
    const response = await POST(
      buildRequest(buildPayload({ transferType: "out" }))
    );

    expect(response.status).toBe(200);

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.status).toBe(OrderStatus.Pending);
  });

  it("bỏ qua khi nội dung chuyển khoản không có mã đơn", async () => {
    const response = await POST(
      buildRequest(buildPayload({ content: "chuyen tien mua khoa hoc" }))
    );

    expect(response.status).toBe(200);

    const order = await OrderModel.findOne({ code: ORDER_CODE });

    expect(order?.status).toBe(OrderStatus.Pending);
    expect(order?.paidAmount).toBe(0);
  });
});
