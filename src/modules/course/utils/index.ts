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
