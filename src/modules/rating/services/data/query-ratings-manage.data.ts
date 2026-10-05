import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchRatingsManage } from "../../actions";
import { FetchRatingsManageParams } from "../../types/rating-manage.types";

interface GetRatingsManageOptionsProps extends FetchRatingsManageParams {
  /** Chỉ để tách cache theo người dùng, server lấy user từ session */
  userId?: string;
  enabled?: boolean;
}

export function getRatingsManageOptions({
  enabled = true,
  userId,
  ...params
}: GetRatingsManageOptionsProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchRatingsManage(params),
    queryKey: [
      QUERY_KEYS.GET_RATINGS,
      params.limit,
      params.page,
      params.search,
      params.status,
      params.courseId,
      userId,
    ],
  });
}

export function useQueryRatingsManage(props: GetRatingsManageOptionsProps) {
  return useQuery(getRatingsManageOptions(props));
}
