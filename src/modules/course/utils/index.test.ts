import { describe, expect, it } from "vitest";
import { CourseLevel } from "@/shared/constants/course.constants";
import {
  buildExploreHref,
  escapeRegExp,
  formatCourseMeta,
  getDiscountLabel,
  isCourseFree,
  isCourseOwned,
  parseExploreFilters,
} from "./index";

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
    expect(
      getDiscountLabel({ isFree: true, price: 0, salePrice: 999_000 }),
    ).toBe("-100%");
  });

  it("khóa có giá thì tính theo giá gốc", () => {
    expect(
      getDiscountLabel({ isFree: false, price: 999_000, salePrice: 1_999_000 }),
    ).toBe("-51%");
  });

  it("không có giá gốc thì không hiện nhãn, tránh chia cho 0", () => {
    expect(getDiscountLabel({ isFree: true, price: 0, salePrice: 0 })).toBe("");
    expect(
      getDiscountLabel({ isFree: false, price: 499_000, salePrice: 0 }),
    ).toBe("");
  });
});

describe("parseExploreFilters", () => {
  it("không có tham số thì về mặc định", () => {
    expect(parseExploreFilters({})).toEqual({
      search: "",
      isFree: false,
      sort: "moi",
      page: 1,
    });
  });

  it("đọc đủ tham số hợp lệ", () => {
    expect(
      parseExploreFilters({
        q: "  next  ",
        gia: "mien-phi",
        trinhdo: "nang-cao",
        sapxep: "danh-gia",
        trang: "3",
      }),
    ).toEqual({
      search: "next",
      isFree: true,
      level: CourseLevel.Expert,
      sort: "danh-gia",
      page: 3,
    });
  });

  it("giá trị lạ thì về mặc định", () => {
    expect(
      parseExploreFilters({
        gia: "re",
        trinhdo: "easy",
        sapxep: "gia-tang",
        trang: "-2",
      }),
    ).toEqual({
      search: "",
      isFree: false,
      level: undefined,
      sort: "moi",
      page: 1,
    });
  });
});

describe("buildExploreHref", () => {
  const defaultFilters = {
    search: "",
    isFree: false,
    sort: "moi" as const,
    page: 1,
  };

  it("bộ lọc mặc định thì không ghi tham số", () => {
    expect(buildExploreHref({ basePath: "/explore" }, defaultFilters)).toBe(
      "/explore",
    );
  });

  it("chỉ ghi tham số khác mặc định, giữ tham số cố định", () => {
    expect(
      buildExploreHref(
        { basePath: "/explore-preview", fixedParams: { tt: "du-lieu" } },
        {
          search: "ai",
          isFree: true,
          level: CourseLevel.Easy,
          sort: "xem-nhieu",
          page: 2,
        },
      ),
    ).toBe(
      "/explore-preview?tt=du-lieu&q=ai&gia=mien-phi&trinhdo=co-ban&sapxep=xem-nhieu&trang=2",
    );
  });
});

describe("escapeRegExp", () => {
  it("thoát ký tự đặc biệt", () => {
    expect(new RegExp(escapeRegExp("c++ (cơ bản)")).test("c++ (cơ bản)")).toBe(
      true,
    );
  });
});

describe("formatCourseMeta", () => {
  it("ghi trình độ và lượt xem rút gọn", () => {
    expect(formatCourseMeta({ level: CourseLevel.Easy, views: 12_480 })).toBe(
      "Cơ bản · 12 nghìn lượt xem",
    );
  });

  it("chưa ai xem thì ghi Khóa mới", () => {
    expect(formatCourseMeta({ level: CourseLevel.Expert, views: 0 })).toBe(
      "Nâng cao · Khóa mới",
    );
  });
});
