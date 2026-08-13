import { describe, expect, it } from "vitest";
import { isCourseFree, isCourseOwned } from "./index";

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
