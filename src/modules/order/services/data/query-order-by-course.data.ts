import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCountOrdersByCourse } from "../../actions";

interface GetOrderCountByCourseProps {
  courseId: string;
}

export function getOrderCountByCourseOptions({
  courseId,
}: GetOrderCountByCourseProps) {
  return queryOptions({
    enabled: !!courseId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCountOrdersByCourse(courseId);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COUNT_ORDERS_BY_COURSE, courseId],
  });
}

export function useQueryOrderCountByCourse({
  courseId,
}: GetOrderCountByCourseProps) {
  const options = getOrderCountByCourseOptions({ courseId });

  return useQuery(options);
}
