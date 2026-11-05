// en-CA định dạng ngày đúng kiểu YYYY-MM-DD
const studyDayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Ngày theo giờ Việt Nam để chống đếm trùng lượt học: học lúc 23h và 1h sáng
 * hôm sau là hai lượt, dù server chạy múi giờ nào
 */
export function buildStudyDayKey(date: Date): string {
  return studyDayFormatter.format(date);
}
