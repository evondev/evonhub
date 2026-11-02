import { setTimeout as wait } from "node:timers/promises";
import { Injectable } from "@nestjs/common";
import type { CourseRecord, CourseSummary } from "./course.types.js";
import { courseRecords } from "./courses.seed.js";

// Giả lập độ trễ của một lần gọi database. Mốc 2 thay bằng MySQL thật.
const FAKE_DB_DELAY_MS = 5;

function toCourseSummary(course: CourseRecord): CourseSummary {
  const ratingTotal = course.rating.reduce((total, star) => total + star, 0);
  const ratingCount = course.rating.length;

  return {
    slug: course.slug,
    title: course.title,
    price: course.price,
    salePrice: course.salePrice,
    level: course.level,
    averageRating: ratingCount === 0 ? null : Math.round((ratingTotal / ratingCount) * 10) / 10,
    ratingCount,
  };
}

@Injectable()
export class CoursesService {
  // Trang danh sách: chỉ khoá đã duyệt và chưa xoá.
  async findPublished() {
    await wait(FAKE_DB_DELAY_MS);

    return courseRecords.filter((course) => course.status === "approved" && !course._destroy).map(toCourseSummary);
  }

  // Trang chi tiết: khoá đã lưu trữ vẫn mở cho người đã mua, chỉ ẩn khoá đã xoá.
  async findBySlug(slug: string) {
    await wait(FAKE_DB_DELAY_MS);
    const course = courseRecords.find((record) => record.slug === slug && !record._destroy);

    return course && toCourseSummary(course);
  }
}
