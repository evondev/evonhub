import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import { ACTIVITY_DETAIL_MAX_LENGTH } from "../constants";
import {
  buildChangedFieldsDetail,
  buildOrderActivityDetail,
  truncateActivityDetail,
} from "./activity-detail.utils";

const fieldLabels = {
  title: "tên khoá",
  price: "giá",
  desc: "mô tả",
  category: "danh mục",
  info: "thông tin khoá",
  video: "video",
  assetId: "video",
};

describe("buildChangedFieldsDetail", () => {
  it("chỉ ghi các trường thật sự đổi", () => {
    const detail = buildChangedFieldsDetail(
      { title: "React", price: 499000, desc: "cũ" },
      { title: "React", price: 599000, desc: "mới" },
      fieldLabels,
    );

    expect(detail).toBe("Đổi: giá, mô tả");
  });

  it("trả rỗng khi lưu lại mà không đổi gì", () => {
    const categoryId = new Types.ObjectId();
    const detail = buildChangedFieldsDetail(
      {
        title: "React",
        price: 499000,
        category: categoryId,
        info: { requirements: ["HTML"] },
      },
      {
        title: "React",
        // Form gửi số dạng chuỗi, ObjectId dạng chuỗi id
        price: "499000",
        category: categoryId.toString(),
        info: { requirements: ["HTML"] },
      },
      fieldLabels,
    );

    expect(detail).toBe("");
  });

  it("coi null, undefined và chuỗi rỗng là như nhau", () => {
    const detail = buildChangedFieldsDetail(
      { desc: null, video: undefined },
      { desc: "", video: "" },
      fieldLabels,
    );

    expect(detail).toBe("");
  });

  it("gộp hai trường cùng nhãn thành một", () => {
    const detail = buildChangedFieldsDetail(
      { video: "a", assetId: "x" },
      { video: "b", assetId: "y" },
      fieldLabels,
    );

    expect(detail).toBe("Đổi: video");
  });

  it("trường chưa có nhãn thì giữ tên gốc", () => {
    const detail = buildChangedFieldsDetail(
      { cta: "Mua" },
      { cta: "Mua ngay" },
      fieldLabels,
    );

    expect(detail).toBe("Đổi: cta");
  });
});

describe("buildOrderActivityDetail", () => {
  it("ghi mã đơn, số tiền có dấu chấm và ghi chú", () => {
    expect(buildOrderActivityDetail("DH123", 1299000, "SePay tự duyệt")).toBe(
      "Đơn DH123 · 1.299.000đ · SePay tự duyệt",
    );
  });

  it("bỏ ghi chú khi không có", () => {
    expect(buildOrderActivityDetail("DH123", 0)).toBe("Đơn DH123 · 0đ");
  });
});

describe("truncateActivityDetail", () => {
  it("gom xuống dòng và khoảng trắng thành một dòng", () => {
    expect(truncateActivityDetail("  Dòng một\n\nDòng   hai ")).toBe(
      "Dòng một Dòng hai",
    );
  });

  it("cắt chuỗi dài, thêm dấu … mà không vượt giới hạn", () => {
    const truncatedText = truncateActivityDetail("a".repeat(500));

    expect(truncatedText.length).toBe(ACTIVITY_DETAIL_MAX_LENGTH);
    expect(truncatedText.endsWith("…")).toBe(true);
  });
});
