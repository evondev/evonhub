import { describe, expect, it } from "vitest";
import { CourseStatus, LEARNABLE_COURSE_STATUSES } from "./course.constants";

describe("LEARNABLE_COURSE_STATUSES", () => {
  it("khóa đang bán vẫn học được", () => {
    expect(LEARNABLE_COURSE_STATUSES).toContain(CourseStatus.Approved);
  });

  it("khóa đã ngừng bán vẫn học được với người đã mua", () => {
    expect(LEARNABLE_COURSE_STATUSES).toContain(CourseStatus.Rejected);
  });

  it("khóa chưa ra mắt thì không nằm trong nhóm học được", () => {
    expect(LEARNABLE_COURSE_STATUSES).not.toContain(CourseStatus.Pending);
  });
});
