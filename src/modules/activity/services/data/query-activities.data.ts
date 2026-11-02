import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchActivities } from "../../actions";
import { ACTIVITY_MANAGE_REFETCH_MS } from "../../constants";
import { FetchActivitiesParams } from "../../types";

interface GetActivitiesOptionsProps extends FetchActivitiesParams {
  enabled?: boolean;
}

export function getActivitiesOptions({
  enabled = true,
  ...params
}: GetActivitiesOptionsProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    // Trang để mở theo dõi: tự làm mới, tab ẩn thì React Query tự dừng
    refetchInterval: ACTIVITY_MANAGE_REFETCH_MS,
    queryFn: () => fetchActivities(params),
    queryKey: [
      QUERY_KEYS.GET_ACTIVITIES,
      params.limit,
      params.page,
      params.search,
      params.tab,
      params.courseId,
    ],
  });
}

export function useQueryActivities(props: GetActivitiesOptionsProps) {
  return useQuery(getActivitiesOptions(props));
}
