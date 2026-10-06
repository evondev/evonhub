import { describe, expect, it } from "vitest";
import {
  extractOrderCode,
  formatRemainingPendingTime,
  isPendingOrderExpired,
  toManualPaymentPayee,
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

describe("toManualPaymentPayee", () => {
  const expert = {
    name: "Nguyễn Văn Chuyên Gia",
    username: "chuyengia",
    email: "chuyengia@example.com",
    socials: { facebook: "https://facebook.com/chuyengia" },
    bank: {
      bankName: " Vietcombank ",
      bankNumber: "1029384756",
      bankAccount: "NGUYEN VAN CHUYEN GIA",
      bankBranch: "",
    },
  };

  it("lấy đủ thông tin nhận tiền và liên hệ của chuyên gia", () => {
    expect(toManualPaymentPayee(expert)).toEqual({
      name: "Nguyễn Văn Chuyên Gia",
      email: "chuyengia@example.com",
      facebook: "https://facebook.com/chuyengia",
      bankName: "Vietcombank",
      bankNumber: "1029384756",
      bankAccount: "NGUYEN VAN CHUYEN GIA",
      bankBranch: undefined,
    });
  });

  it("trả về undefined khi chuyên gia chưa điền số tài khoản", () => {
    expect(
      toManualPaymentPayee({
        ...expert,
        bank: { ...expert.bank, bankNumber: "  " },
      }),
    ).toBeUndefined();
  });

  it("bỏ link Facebook không phải http(s)", () => {
    const payee = toManualPaymentPayee({
      ...expert,
      socials: { facebook: "javascript:alert(1)" },
    });

    expect(payee?.facebook).toBeUndefined();
  });
});
