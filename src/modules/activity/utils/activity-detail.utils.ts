import { formatThoundsand } from "@/shared/utils";
import { Types } from "mongoose";
import { ACTIVITY_DETAIL_MAX_LENGTH } from "../constants";

/** Gom khoảng trắng, cắt về ACTIVITY_DETAIL_MAX_LENGTH cho dòng phụ */
export function truncateActivityDetail(text: string): string {
  const singleLineText = text.replace(/\s+/g, " ").trim();

  if (singleLineText.length <= ACTIVITY_DETAIL_MAX_LENGTH) return singleLineText;

  return `${singleLineText.slice(0, ACTIVITY_DETAIL_MAX_LENGTH - 1).trimEnd()}…`;
}

/** "Đơn DH12345678 · 499.000đ · SePay tự duyệt" */
export function buildOrderActivityDetail(
  code: string,
  total: number,
  note?: string,
): string {
  const orderParts = [`Đơn ${code}`, `${formatThoundsand(total)}đ`];

  if (note) orderParts.push(note);

  return orderParts.join(" · ");
}

/** Số, chuỗi, ObjectId, object về cùng một dạng chuỗi để so trước / sau */
function normalizeFieldValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  // ObjectId trong DB so như chuỗi id mà form gửi lên
  if (value instanceof Types.ObjectId) return value.toString();

  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
}

/**
 * Tên các trường thật sự đổi giữa bản cũ và dữ liệu sắp lưu: "Đổi: giá, mô tả".
 * Form gửi lên mọi trường mỗi lần lưu, nên phải so mới biết đã sửa gì. Không
 * đổi gì thì trả rỗng, để khỏi ghi dòng "Sửa" thừa.
 */
export function buildChangedFieldsDetail(
  previousValues: Record<string, unknown>,
  nextValues: Record<string, unknown>,
  fieldLabels: Record<string, string>,
): string {
  const changedLabels = Object.keys(nextValues)
    .filter(
      (field) =>
        normalizeFieldValue(previousValues[field]) !==
        normalizeFieldValue(nextValues[field]),
    )
    .map((field) => fieldLabels[field] || field);
  const uniqueLabels = Array.from(new Set(changedLabels));

  if (uniqueLabels.length === 0) return "";

  return `Đổi: ${uniqueLabels.join(", ")}`;
}
