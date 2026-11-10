import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchTopLessons } from "../../actions";
import { ACTIVITY_MANAGE_REFETCH_MS } from "../../constants";
import { FetchTopLessonsParams } from "../../types";

interface GetTopLessonsOptionsProps extends FetchTopLessonsParams {
  enabled?: boolean;
}

export function getTopLessonsOptions({
  enabled = true,
  ...params
}: GetTopLessonsOptionsProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    // Cùng nhịp với nhật ký để số trên các tab không bị cũ
    refetchInterval: ACTIVITY_MANAGE_REFETCH_MS,
    queryFn: () => fetchTopLessons(params),
    queryKey: [
      QUERY_KEYS.GET_TOP_LESSONS,
      params.limit,
      params.page,
      params.search,
      params.courseId,
      params.from,
      params.to,
    ],
  });
}

export function useQueryTopLessons(props: GetTopLessonsOptionsProps) {
  return useQuery(getTopLessonsOptions(props));
}
