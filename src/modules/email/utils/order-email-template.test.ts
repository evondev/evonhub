import { describe, expect, it } from "vitest";
import {
  buildOrderApprovedEmail,
  buildOrderReminderEmail,
} from "./order-email-template";

const reminderData = {
  code: "DH12345678",
  username: "hocvien",
  total: 999_000,
  remainingTime: "18 giờ",
  qrUrl: "https://qr.sepay.vn/img?acc=1&bank=ACB",
  courseTitle: "Khóa học NextJS Pro",
};

describe("buildOrderReminderEmail", () => {
  it("dẫn về trang đơn hàng của tôi và cả trang thanh toán", () => {
    const { html } = buildOrderReminderEmail(reminderData);

    expect(html).toContain("https://evonhub.dev/my-orders");
    expect(html).toContain("https://evonhub.dev/order/DH12345678");
  });

  it("hiện mã đơn, số tiền và thời hạn còn lại", () => {
    const { subject, html } = buildOrderReminderEmail(reminderData);

    expect(subject).toContain("DH12345678");
    expect(html).toContain("999.000");
    expect(html).toContain("18 giờ");
    expect(html).toContain(reminderData.qrUrl);
  });
});

describe("buildOrderApprovedEmail", () => {
  it("dẫn về khu vực học tập và nêu tên khóa học", () => {
    const { subject, html } = buildOrderApprovedEmail({
      code: "DH12345678",
      username: "hocvien",
      total: 999_000,
      courseTitle: "Khóa học NextJS Pro",
    });

    expect(subject).toContain("DH12345678");
    expect(html).toContain("https://evonhub.dev/study");
    expect(html).toContain("Khóa học NextJS Pro");
  });
});
