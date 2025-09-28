import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUserCoursesContinue } from "../../actions";

interface GetUserCourseContinueProps {
  userId: string;
  limit?: number;
}

export function useQueryUserCourseContinue({
  userId,
  limit,
}: GetUserCourseContinueProps) {
  return useQuery({
    enabled: !!userId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUserCoursesContinue({ userId, limit });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_COURSE_CONTINUE, userId, limit],
  });
}
