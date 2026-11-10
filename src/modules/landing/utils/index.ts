import { CatalogStats, CourseItemData } from "@/modules/course/types";
import { cn } from "@/shared/utils";
import {
  HERO_TITLE_ACCENT,
  HERO_TITLE_LEAD,
  HERO_WORD_DELAY_MS,
  heroHighlights,
} from "../constants";
import {
  CodeToken,
  CodeTokenKind,
  HeroTitleWords,
  LandingStatItem,
} from "../types";

/** Tách tiêu đề hero thành từng chữ để mỗi chữ hiện lên lần lượt */
export function buildHeroTitleWords(): HeroTitleWords {
  const leadWords = HERO_TITLE_LEAD.split(" ").map((text) => ({ text }));

  return {
    leadWords,
    accentText: HERO_TITLE_ACCENT,
    accentDelayMs: leadWords.length * HERO_WORD_DELAY_MS,
  };
}

/** Khóa nhiều lượt học đứng trước, không đổi mảng gốc */
export function sortCoursesByStudyCount(
  courses: CourseItemData[],
): CourseItemData[] {
  return [...courses].sort(
    (firstCourse, secondCourse) =>
      (secondCourse.studyCount || 0) - (firstCourse.studyCount || 0),
  );
}

/** Số liệu dưới hero; số nào bằng 0 thì bỏ, không khoe con số 0 */
export function buildLandingStatItems(stats: CatalogStats): LandingStatItem[] {
  const statItems: LandingStatItem[] = [];

  if (stats.courseCount > 0) {
    statItems.push({
      value: stats.courseCount,
      format: "integer",
      label: "khóa học đang mở",
      hint:
        stats.freeCourseCount > 0
          ? `Trong đó ${stats.freeCourseCount} khóa miễn phí`
          : "Xem tất cả →",
      url: "/explore",
    });
  }

  if (stats.totalStudyCount > 0) {
    statItems.push({
      value: stats.totalStudyCount,
      format: "compact",
      label: "lượt vào học",
      hint: "Mỗi người tính một lượt mỗi ngày",
    });
  }

  if (stats.ratingCount > 0) {
    statItems.push({
      value: stats.averageRating,
      format: "rating",
      label: "điểm đánh giá trung bình",
      hint: `Từ ${stats.ratingCount} đánh giá của học viên`,
    });
  }

  return statItems;
}

/** Số cột của dải số liệu theo đúng số ô, để lưới không còn ô trống */
export function getStatsGridClassName(statCount: number): string {
  return cn(
    statCount === 2 && "sm:grid-cols-2",
    statCount === 3 && "sm:grid-cols-3",
  );
}

/** Các điểm dưới nút hero: thêm số khóa miễn phí khi có */
export function buildHeroHighlights(freeCourseCount: number): string[] {
  if (freeCourseCount === 0) return heroHighlights;

  return [`${freeCourseCount} khóa miễn phí`, ...heroHighlights];
}

/** Vế nhạt của CTA cuối trang, theo việc có khóa miễn phí hay không */
export function getFinalCtaMutedTitle(freeCourseCount: number): string {
  if (freeCourseCount === 0) return "Bài học thử không tốn gì.";

  return `${freeCourseCount} khóa đang miễn phí.`;
}

// Từ khoá, thẻ JSX, tên prop trước dấu "=", và lời gọi gây lỗi trong đoạn code hero
const CODE_TOKEN_PATTERN =
  /(\b(?:export|function|return|const|async|await)\b)|(<\/?[A-Za-z][\w.]*|\/?>)|(\b[a-z]\w*(?==))|(Math\.random\(\))/g;

const CODE_TOKEN_KINDS: CodeTokenKind[] = [
  "keyword",
  "tag",
  "attribute",
  "danger",
];

/** Tách một dòng code thành các mẩu để tô màu như editor, không cần thư viện */
export function tokenizeCodeLine(code: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let lastIndex = 0;

  for (const match of Array.from(code.matchAll(CODE_TOKEN_PATTERN))) {
    const matchIndex = match.index ?? 0;
    const groupIndex = match.slice(1).findIndex(Boolean);

    if (matchIndex > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, matchIndex), kind: "plain" });
    }

    tokens.push({ text: match[0], kind: CODE_TOKEN_KINDS[groupIndex] });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), kind: "plain" });
  }

  return tokens;
}

/** Màu từng loại mẩu code, cùng tông editor tối */
export function getCodeTokenClassName(tokenKind: CodeTokenKind): string {
  return cn(
    tokenKind === "keyword" && "text-violet-300",
    tokenKind === "tag" && "text-sky-300",
    tokenKind === "attribute" && "text-amber-200",
    tokenKind === "danger" && "rounded bg-rose-500/20 text-rose-300",
  );
}
