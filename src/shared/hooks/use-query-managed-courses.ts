"use client";

import { fetchManagedCourseOptions } from "@/shared/actions/course";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { useQuery } from "@tanstack/react-query";

/** Khoá cho bộ lọc "Khoá học"; userId chỉ để tách cache theo người dùng */
export function useQueryManagedCourses(userId?: string) {
  return useQuery({
    queryFn: () => fetchManagedCourseOptions(),
    queryKey: [QUERY_KEYS.GET_MANAGED_COURSES, userId],
  });
}
