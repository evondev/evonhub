import { describe, expect, it } from "vitest";
import { buildPaginationItems } from ".";

describe("buildPaginationItems", () => {
  it("ít trang thì ghi hết số", () => {
    expect(buildPaginationItems(1, 3)).toEqual([1, 2, 3]);
  });

  it("hụt một trang thì ghi số thay vì dấu …", () => {
    expect(buildPaginationItems(4, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("trang giữa có … hai bên", () => {
    expect(buildPaginationItems(6, 12)).toEqual([
      1,
      "ellipsis",
      5,
      6,
      7,
      "ellipsis",
      12,
    ]);
  });

  it("nhiều trang thì luôn đủ 7 ô ở đầu, giữa, cuối", () => {
    expect(buildPaginationItems(1, 435)).toEqual([
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      435,
    ]);
    expect(buildPaginationItems(4, 435)).toEqual([
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      435,
    ]);
    expect(buildPaginationItems(5, 435)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      435,
    ]);
    expect(buildPaginationItems(432, 435)).toEqual([
      1,
      "ellipsis",
      431,
      432,
      433,
      434,
      435,
    ]);
    expect(buildPaginationItems(435, 435)).toEqual([
      1,
      "ellipsis",
      431,
      432,
      433,
      434,
      435,
    ]);
  });

  it("đúng 7 trang thì ghi hết, không có …", () => {
    expect(buildPaginationItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("chỉ một trang", () => {
    expect(buildPaginationItems(1, 1)).toEqual([1]);
  });
});
