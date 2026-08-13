import { describe, expect, it } from "vitest";
import {
  buildOrderApprovedEmail,
  buildOrderCreatedEmail,
  buildOrderReminderEmail,
} from "./order-email-template";

const baseData = {
  code: "DH12345678",
  username: "hocvien",
  total: 999_000,
  qrUrl: "https://qr.sepay.vn/img?acc=1&bank=ACB",
  courseTitle: "Khóa học NextJS Pro",
};

describe("buildOrderCreatedEmail", () => {
  it("có QR, số tiền, nội dung chuyển khoản và nút mở trang thanh toán", () => {
    const { subject, html } = buildOrderCreatedEmail(baseData);

    expect(subject).toContain("DH12345678");
    expect(html).toContain(baseData.qrUrl);
    expect(html).toContain("999.000");
    expect(html).toContain("DH12345678");
    expect(html).toContain("https://evonhub.dev/order/DH12345678");
    expect(html).toContain("https://evonhub.dev/my-orders");
  });

  it("nói rõ thời hạn giữ đơn", () => {
    const { html } = buildOrderCreatedEmail(baseData);

    expect(html).toContain("24 giờ");
  });

  it("vẫn chạy khi thiếu tên khóa học", () => {
    const { html } = buildOrderCreatedEmail({
      ...baseData,
      courseTitle: undefined,
    });

    expect(html).toContain("khóa học");
  });
});

describe("buildOrderReminderEmail", () => {
  const reminderData = { ...baseData, remainingTime: "18 giờ" };

  it("dẫn về cả trang thanh toán lẫn đơn hàng của tôi", () => {
    const { html } = buildOrderReminderEmail(reminderData);

    expect(html).toContain("https://evonhub.dev/order/DH12345678");
    expect(html).toContain("https://evonhub.dev/my-orders");
  });

  it("hiện mã đơn, số tiền, thời hạn còn lại và QR", () => {
    const { subject, html } = buildOrderReminderEmail(reminderData);

    expect(subject).toContain("DH12345678");
    expect(html).toContain("999.000");
    expect(html).toContain("18 giờ");
    expect(html).toContain(reminderData.qrUrl);
  });
});

describe("buildOrderApprovedEmail", () => {
  it("dẫn về khu vực học tập và nêu tên khóa học", () => {
    const { subject, html } = buildOrderApprovedEmail(baseData);

    expect(subject).toContain("Khóa học NextJS Pro");
    expect(html).toContain("https://evonhub.dev/study");
    expect(html).toContain("Khóa học NextJS Pro");
    expect(html).toContain("999.000");
  });

  it("dùng tên gói khi đơn không gắn khóa học", () => {
    const { html } = buildOrderApprovedEmail({
      code: "DH12345678",
      username: "hocvien",
      total: 700_000,
      plan: "master",
    });

    expect(html).toContain("gói master");
  });
});

describe("khung email dùng chung", () => {
  it("mọi email đều có logo, dòng preview và footer hỗ trợ", () => {
    const emails = [
      buildOrderCreatedEmail(baseData).html,
      buildOrderReminderEmail({ ...baseData, remainingTime: "2 giờ" }).html,
      buildOrderApprovedEmail(baseData).html,
    ];

    for (const html of emails) {
      expect(html).toContain("https://evonhub.dev/logo-main.png");
      expect(html).toContain("trả lời thẳng email này");
      expect(html).toContain("#978df8");
    }
  });
});
