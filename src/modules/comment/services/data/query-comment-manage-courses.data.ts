import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { useQuery } from "@tanstack/react-query";
import { fetchCommentManageCourses } from "../../actions";

/** Khoá cho bộ lọc "Khoá học"; userId chỉ để tách cache theo người dùng */
export function useQueryCommentManageCourses(userId?: string) {
  return useQuery({
    queryFn: () => fetchCommentManageCourses(),
    queryKey: [QUERY_KEYS.GET_COMMENT_MANAGE_COURSES, userId],
  });
}
