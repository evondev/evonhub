import { describe, expect, it } from "vitest";
import { ACTIVITY_MANAGE_DEFAULT_FILTERS } from "../constants";
import { ActivityManageFilters, TopLessonRow } from "../types";
import {
  filterPreviewTopLessons,
  formatStudyMinutes,
} from "./activity-top-lessons.utils";

describe("formatStudyMinutes", () => {
  it("ghi phút, giờ, hay cả hai", () => {
    expect(formatStudyMinutes(0)).toBe("0 phút");
    expect(formatStudyMinutes(45)).toBe("45 phút");
    expect(formatStudyMinutes(120)).toBe("2 giờ");
    expect(formatStudyMinutes(65)).toBe("1 giờ 5 phút");
    expect(formatStudyMinutes(1000 * 60)).toBe("1.000 giờ");
  });
});

describe("filterPreviewTopLessons", () => {
  const lessons = [
    { id: "a", courseTitle: "Khoá A", rank: 1 },
    { id: "b", courseTitle: "Khoá B", rank: 2 },
    { id: "c", courseTitle: "Khoá A", rank: 3 },
  ] as TopLessonRow[];
  const courseTitleById = { c01: "Khoá A" };

  it("lọc theo khoá rồi đánh lại hạng", () => {
    const filters: ActivityManageFilters = {
      ...ACTIVITY_MANAGE_DEFAULT_FILTERS,
      courseId: "c01",
    };
    const matched = filterPreviewTopLessons(lessons, filters, courseTitleById);

    expect(matched.map((lesson) => [lesson.id, lesson.rank])).toEqual([
      ["a", 1],
      ["c", 2],
    ]);
  });

  it("có từ khoá tìm người thì rỗng", () => {
    const filters: ActivityManageFilters = {
      ...ACTIVITY_MANAGE_DEFAULT_FILTERS,
      search: "vy",
    };

    expect(filterPreviewTopLessons(lessons, filters, courseTitleById)).toEqual(
      [],
    );
  });
});
