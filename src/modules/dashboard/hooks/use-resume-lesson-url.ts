"use client";

import { handleGetLastUrl } from "@/shared/helpers";
import { useEffect, useState } from "react";
import { DashboardLessonLink } from "../types";
import { getLessonFallbackUrl } from "../utils";

/**
 * Link vào bài đang học dở. Bài cuối nằm trong localStorage nên chỉ đọc được
 * sau khi mount; trước đó dùng bài đầu của khóa để server và client khớp nhau.
 */
export function useResumeLessonUrl(slug: string, lesson: DashboardLessonLink) {
  const [lessonUrl, setLessonUrl] = useState(
    getLessonFallbackUrl(slug, lesson),
  );

  useEffect(() => {
    setLessonUrl(`/${slug}/lesson${handleGetLastUrl(slug, lesson)}`);
  }, [slug, lesson]);

  return lessonUrl;
}
