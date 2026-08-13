import { describe, expect, it } from "vitest";
import { getDiscountLabel, isCourseFree, isCourseOwned } from "./index";

describe("isCourseFree", () => {
  it("miễn phí khi bật cờ free và giá 0", () => {
    expect(isCourseFree({ price: 0, free: true })).toBe(true);
  });

  it("KHÔNG miễn phí khi bật cờ free nhưng vẫn có giá", () => {
    expect(isCourseFree({ price: 499_000, free: true })).toBe(false);
  });

  it("không miễn phí khi tắt cờ free", () => {
    expect(isCourseFree({ price: 0, free: false })).toBe(false);
  });

  it("không miễn phí khi thiếu dữ liệu", () => {
    expect(isCourseFree({})).toBe(false);
  });
});

describe("isCourseOwned", () => {
  it("nhận diện được mảng ObjectId", () => {
    expect(isCourseOwned(["abc", "xyz"], "xyz")).toBe(true);
  });

  it("nhận diện được mảng document đã populate", () => {
    expect(isCourseOwned([{ _id: "xyz" }], "xyz")).toBe(true);
  });

  it("trả false khi danh sách rỗng", () => {
    expect(isCourseOwned([], "xyz")).toBe(false);
    expect(isCourseOwned(undefined, "xyz")).toBe(false);
  });
});

describe("getDiscountLabel", () => {
  it("khóa miễn phí có giá gốc thì hiện -100%", () => {
    expect(getDiscountLabel({ isFree: true, price: 0, salePrice: 999_000 })).toBe(
      "-100%"
    );
  });

  it("khóa có giá thì tính theo giá gốc", () => {
    expect(
      getDiscountLabel({ isFree: false, price: 999_000, salePrice: 1_999_000 })
    ).toBe("-51 %");
  });

  it("không có giá gốc thì không hiện nhãn, tránh chia cho 0", () => {
    expect(getDiscountLabel({ isFree: true, price: 0, salePrice: 0 })).toBe("");
    expect(
      getDiscountLabel({ isFree: false, price: 499_000, salePrice: 0 })
    ).toBe("");
  });
});
