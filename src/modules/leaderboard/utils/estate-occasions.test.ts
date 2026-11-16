import { describe, expect, it } from "vitest";
import { getEstateOccasions, parseEstateDateKey } from "./estate-occasions.utils";

function occasionsOn(dateKey: string) {
  const date = parseEstateDateKey(dateKey);

  if (!date) throw new Error(`Ngày sai: ${dateKey}`);

  return getEstateOccasions(date);
}

describe("getEstateOccasions", () => {
  it("mùa theo tháng miền Bắc", () => {
    expect(occasionsOn("2027-03-10").season).toBe("spring");
    expect(occasionsOn("2027-07-01").season).toBe("summer");
    expect(occasionsOn("2026-11-16").season).toBe("autumn");
    expect(occasionsOn("2027-01-05").season).toBe("winter");
    expect(occasionsOn("2026-12-01").season).toBe("winter");
  });

  it("Giáng sinh 20–26/12", () => {
    expect(occasionsOn("2026-12-19").isChristmas).toBe(false);
    expect(occasionsOn("2026-12-20").isChristmas).toBe(true);
    expect(occasionsOn("2026-12-26").isChristmas).toBe(true);
    expect(occasionsOn("2026-12-27").isChristmas).toBe(false);
  });

  it("Tết từ 7 ngày trước tới 7 ngày sau mùng 1", () => {
    expect(occasionsOn("2027-01-30").isTet).toBe(true);
    expect(occasionsOn("2027-02-06").isTet).toBe(true);
    expect(occasionsOn("2027-02-13").isTet).toBe(true);
    expect(occasionsOn("2027-02-14").isTet).toBe(false);
    expect(occasionsOn("2027-01-29").isTet).toBe(false);
  });

  it("Trung thu từ 7 ngày trước tới 1 ngày sau rằm", () => {
    expect(occasionsOn("2027-09-08").isMidAutumn).toBe(true);
    expect(occasionsOn("2027-09-16").isMidAutumn).toBe(true);
    expect(occasionsOn("2027-09-17").isMidAutumn).toBe(false);
    expect(occasionsOn("2027-09-07").isMidAutumn).toBe(false);
  });
});

describe("parseEstateDateKey", () => {
  it("bỏ qua chuỗi sai định dạng", () => {
    expect(parseEstateDateKey("24-12-2026")).toBeNull();
    expect(parseEstateDateKey(null)).toBeNull();
  });
});
