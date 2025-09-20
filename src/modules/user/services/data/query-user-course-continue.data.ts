import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUserCoursesContinue } from "../../actions";

interface GetUserCourseContinueProps {
  userId: string;
}

export function useQueryUserCourseContinue({
  userId,
}: GetUserCourseContinueProps) {
  return useQuery({
    enabled: !!userId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUserCoursesContinue({ userId });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_USER_COURSE_CONTINUE, userId],
  });
}
