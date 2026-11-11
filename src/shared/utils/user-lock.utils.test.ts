import { describe, expect, it } from "vitest";
import { UserLockDuration } from "../constants/user.constants";
import {
  formatUserLockUntil,
  getUserLockUntil,
  isUserLockExpired,
} from "./user-lock.utils";

const now = new Date("2026-11-11T03:00:00.000Z");

describe("getUserLockUntil", () => {
  it("cộng đúng số ngày", () => {
    expect(
      getUserLockUntil(UserLockDuration.SevenDays, now)?.toISOString(),
    ).toBe("2026-11-18T03:00:00.000Z");
  });

  it("vĩnh viễn là null", () => {
    expect(getUserLockUntil(UserLockDuration.Forever, now)).toBeNull();
  });

  it("mức không có trong danh sách là undefined", () => {
    expect(getUserLockUntil("99d" as UserLockDuration, now)).toBeUndefined();
  });
});

describe("isUserLockExpired", () => {
  it("qua hạn thì hết hạn", () => {
    expect(
      isUserLockExpired({ until: new Date("2026-11-11T02:59:59.000Z") }, now),
    ).toBe(true);
  });

  it("chưa tới hạn thì chưa hết", () => {
    expect(
      isUserLockExpired({ until: new Date("2026-11-11T03:00:01.000Z") }, now),
    ).toBe(false);
  });

  it("khoá vĩnh viễn hoặc không có thông tin khoá thì không bao giờ hết hạn", () => {
    expect(isUserLockExpired({ until: null }, now)).toBe(false);
    expect(isUserLockExpired(undefined, now)).toBe(false);
  });
});

describe("formatUserLockUntil", () => {
  it("vĩnh viễn trả null", () => {
    expect(formatUserLockUntil(null)).toBeNull();
  });
});
