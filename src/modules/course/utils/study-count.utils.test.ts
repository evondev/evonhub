import { describe, expect, it } from "vitest";
import { buildStudyDayKey } from "./study-count.utils";

describe("buildStudyDayKey", () => {
  it("ghi ngày dạng YYYY-MM-DD", () => {
    expect(buildStudyDayKey(new Date("2026-11-05T03:00:00Z"))).toBe(
      "2026-11-05",
    );
  });

  it("tính theo giờ Việt Nam: 18h UTC đã sang ngày mới", () => {
    expect(buildStudyDayKey(new Date("2026-11-05T17:30:00Z"))).toBe(
      "2026-11-06",
    );
  });
});
