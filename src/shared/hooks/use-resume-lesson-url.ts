"use client";

import { handleGetLastUrl } from "@/shared/helpers";
import { LessonLinkData } from "@/shared/types/lesson.types";
import { useEffect, useState } from "react";

/**
 * Link vào bài đang học dở. Bài cuối nằm trong localStorage nên chỉ đọc được
 * sau khi mount; trước đó dùng bài truyền vào để server và client khớp nhau.
 */
export function useResumeLessonUrl(slug: string, lesson?: LessonLinkData) {
  const [lessonUrl, setLessonUrl] = useState(
    `/${slug}/lesson?id=${lesson?._id || ""}`,
  );
  const lessonId = lesson?._id || "";
  const lessonSlug = lesson?.slug || "";

  useEffect(() => {
    setLessonUrl(
      `/${slug}/lesson${handleGetLastUrl(slug, { _id: lessonId, slug: lessonSlug })}`,
    );
  }, [slug, lessonId, lessonSlug]);

  return lessonUrl;
}
