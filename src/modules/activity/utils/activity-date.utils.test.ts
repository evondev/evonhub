import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import {
  buildActivityDatePresets,
  buildActivityDateRangeQuery,
  formatActivityDateRangeLabel,
  isActivityDateString,
  isInActivityDateRange,
} from "./activity-date.utils";

const presets = buildActivityDatePresets(dayjs("2026-11-08"));

describe("isActivityDateString", () => {
  it("nhận ngày có thật dạng YYYY-MM-DD", () => {
    expect(isActivityDateString("2026-11-08")).toBe(true);
  });

  it("chặn ngày tràn, sai dạng và object toán tử từ client", () => {
    expect(isActivityDateString("2026-02-31")).toBe(false);
    expect(isActivityDateString("08/11/2026")).toBe(false);
    expect(isActivityDateString({ $ne: null })).toBe(false);
    expect(isActivityDateString("")).toBe(false);
  });
});

describe("buildActivityDateRangeQuery", () => {
  it("tính theo giờ Việt Nam và gồm cả ngày cuối", () => {
    const dateRangeQuery = buildActivityDateRangeQuery(
      "2026-11-08",
      "2026-11-08",
    );

    expect(dateRangeQuery?.$gte?.toISOString()).toBe(
      "2026-11-07T17:00:00.000Z",
    );
    expect(dateRangeQuery?.$lt?.toISOString()).toBe("2026-11-08T17:00:00.000Z");
  });

  it("đổi chỗ khi chọn ngược", () => {
    const dateRangeQuery = buildActivityDateRangeQuery(
      "2026-11-08",
      "2026-11-01",
    );

    expect(dateRangeQuery?.$gte?.toISOString()).toBe(
      "2026-10-31T17:00:00.000Z",
    );
    expect(dateRangeQuery?.$lt?.toISOString()).toBe("2026-11-08T17:00:00.000Z");
  });

  it("chỉ chặn một đầu khi đầu kia rỗng hoặc sai dạng", () => {
    const dateRangeQuery = buildActivityDateRangeQuery("2026-11-01", "abc");

    expect(dateRangeQuery?.$gte).toBeInstanceOf(Date);
    expect(dateRangeQuery?.$lt).toBeUndefined();
  });

  it("không lọc gì thì null", () => {
    expect(buildActivityDateRangeQuery("", "")).toBeNull();
    expect(buildActivityDateRangeQuery(undefined, undefined)).toBeNull();
  });
});

describe("isInActivityDateRange", () => {
  it("23 giờ đêm ở VN vẫn thuộc ngày đó dù UTC đã sang ngày khác", () => {
    expect(
      isInActivityDateRange(
        "2026-11-07T17:30:00.000Z",
        "2026-11-08",
        "2026-11-08",
      ),
    ).toBe(true);
    expect(
      isInActivityDateRange(
        "2026-11-07T16:59:00.000Z",
        "2026-11-08",
        "2026-11-08",
      ),
    ).toBe(false);
  });
});

describe("formatActivityDateRangeLabel", () => {
  it("trùng lựa chọn nhanh thì ghi tên lựa chọn", () => {
    expect(
      formatActivityDateRangeLabel(presets, "2026-11-08", "2026-11-08"),
    ).toBe("Hôm nay");
    expect(
      formatActivityDateRangeLabel(presets, "2026-11-02", "2026-11-08"),
    ).toBe("7 ngày qua");
  });

  it("ghi ngày hoặc khoảng ngày khi không trùng", () => {
    expect(
      formatActivityDateRangeLabel(presets, "2026-11-01", "2026-11-01"),
    ).toBe("01/11/2026");
    expect(
      formatActivityDateRangeLabel(presets, "2026-11-01", "2026-11-05"),
    ).toBe("01/11 – 05/11/2026");
    expect(formatActivityDateRangeLabel(presets, "", "")).toBe("");
  });
});
