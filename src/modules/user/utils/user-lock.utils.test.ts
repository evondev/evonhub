import {
  USER_LOCK_REASON_MAX_LENGTH,
  UserLockDuration,
  UserStatus,
} from "@/shared/constants/user.constants";
import { describe, expect, it } from "vitest";
import { buildUserStatusUpdate } from "./user-lock.utils";

const now = new Date("2026-11-11T03:00:00.000Z");

describe("buildUserStatusUpdate", () => {
  it("mở khoá thì xoá thông tin khoá", () => {
    expect(buildUserStatusUpdate(UserStatus.Active, undefined, now)).toEqual({
      $set: { status: UserStatus.Active },
      $unset: { lock: 1 },
    });
  });

  it("khoá có hạn ghi hạn và lý do đã cắt khoảng trắng", () => {
    expect(
      buildUserStatusUpdate(
        UserStatus.Inactive,
        { duration: UserLockDuration.OneDay, reason: "  Spam  " },
        now,
      ),
    ).toEqual({
      $set: {
        status: UserStatus.Inactive,
        lock: {
          reason: "Spam",
          until: new Date("2026-11-12T03:00:00.000Z"),
          at: now,
        },
      },
    });
  });

  it("không gửi lock thì khoá vĩnh viễn, không lý do", () => {
    expect(buildUserStatusUpdate(UserStatus.Inactive, undefined, now)).toEqual({
      $set: {
        status: UserStatus.Inactive,
        lock: { reason: "", until: null, at: now },
      },
    });
  });

  it("thời hạn bậy thì từ chối", () => {
    expect(
      buildUserStatusUpdate(
        UserStatus.Inactive,
        { duration: "1y" as UserLockDuration, reason: "" },
        now,
      ),
    ).toBeNull();
  });

  it("lý do dài quá thì cắt bớt", () => {
    const update = buildUserStatusUpdate(
      UserStatus.Inactive,
      { duration: UserLockDuration.Forever, reason: "a".repeat(1000) },
      now,
    );

    expect(update?.$set?.lock.reason).toHaveLength(USER_LOCK_REASON_MAX_LENGTH);
  });
});
