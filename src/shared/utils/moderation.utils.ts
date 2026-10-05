import { isValidObjectId } from "mongoose";
import { MAX_EXCLUDED_IDS } from "../constants/moderation.constants";

/** Danh sách id bỏ tick gửi từ client: mảng id hợp lệ, không quá dài (rỗng cũng được) */
export function isExcludedIdList(
  excludedIds: unknown,
): excludedIds is string[] {
  return (
    Array.isArray(excludedIds) &&
    excludedIds.length <= MAX_EXCLUDED_IDS &&
    excludedIds.every(
      (excludedId) =>
        typeof excludedId === "string" && isValidObjectId(excludedId),
    )
  );
}

/** Từ khoá hợp lệ để lọc nội dung, chuỗi rỗng là không lọc */
export function getSafeKeyword(search: unknown): string {
  return typeof search === "string" ? search.trim() : "";
}
