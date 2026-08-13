import { describe, expect, it } from "vitest";
import {
  extractOrderCode,
  formatRemainingPendingTime,
  isPendingOrderExpired,
} from "./index";

const HOUR_IN_MS = 60 * 60 * 1000;
const now = new Date("2026-08-13T12:00:00.000Z");

describe("formatRemainingPendingTime", () => {
  it("trả về số giờ còn lại, làm tròn lên", () => {
    const createdAt = new Date(now.getTime() - 6 * HOUR_IN_MS);

    expect(formatRemainingPendingTime(createdAt, now)).toBe("18 giờ");
  });

  it("trả về số phút khi còn dưới 1 giờ", () => {
    const createdAt = new Date(now.getTime() - 23.5 * HOUR_IN_MS);

    expect(formatRemainingPendingTime(createdAt, now)).toBe("30 phút");
  });

  it("trả về chuỗi rỗng khi đã quá hạn", () => {
    const createdAt = new Date(now.getTime() - 25 * HOUR_IN_MS);

    expect(formatRemainingPendingTime(createdAt, now)).toBe("");
  });
});

describe("isPendingOrderExpired", () => {
  it("đơn tạo trong 24 giờ thì còn hiệu lực", () => {
    expect(
      isPendingOrderExpired(new Date(now.getTime() - 23 * HOUR_IN_MS), now)
    ).toBe(false);
  });

  it("đơn tạo quá 24 giờ thì hết hạn", () => {
    expect(
      isPendingOrderExpired(new Date(now.getTime() - 25 * HOUR_IN_MS), now)
    ).toBe(true);
  });
});

describe("extractOrderCode", () => {
  it("lấy mã đơn từ nội dung chuyển khoản", () => {
    expect(extractOrderCode(null, "CT DEN:123 DH12345678 thanh toan")).toBe(
      "DH12345678"
    );
  });

  it("ưu tiên trường đầu tiên có mã", () => {
    expect(extractOrderCode("DH11111111", "DH22222222")).toBe("DH11111111");
  });

  it("trả về rỗng khi không có mã", () => {
    expect(extractOrderCode(null, "chuyen tien mua khoa hoc")).toBe("");
  });
});
