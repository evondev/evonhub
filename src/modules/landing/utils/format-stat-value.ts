import { formatCompactCount } from "@/shared/helpers/number.helper";
import { StatValueFormat } from "../types";

/** Hiện số liệu theo kiểu của nó; dùng cả lúc đang đếm lên nên phải làm tròn */
export function formatStatValue(
  value: number,
  format: StatValueFormat,
): string {
  if (format === "rating") return `${value.toFixed(1).replace(".", ",")}/5`;

  if (format === "compact") return formatCompactCount(Math.round(value));

  return Math.round(value).toLocaleString("vi-VN");
}
