/**
 * Kiểm tra user đã sở hữu khóa học hay chưa.
 * `courses` có thể là mảng ObjectId hoặc mảng document đã populate.
 */
export function isCourseOwned(
  courses: unknown[] | undefined,
  courseId: string,
): boolean {
  if (!courses?.length) return false;

  return courses
    .filter(Boolean)
    .map((course) => {
      const populatedCourse = course as { _id?: unknown };

      return String(populatedCourse?._id ?? course);
    })
    .includes(courseId);
}

interface CourseFreeCheck {
  price?: number;
  free?: boolean;
}

/**
 * Khóa chỉ được coi là miễn phí khi vừa bật cờ `free` vừa có giá 0.
 * Giữ đúng một định nghĩa cho cả UI lẫn server để cờ `free` bật nhầm trên khóa
 * có giá không biến nó thành khóa cho không.
 */
export function isCourseFree({ price, free }: CourseFreeCheck): boolean {
  return !!free && (price ?? 0) <= 0;
}
