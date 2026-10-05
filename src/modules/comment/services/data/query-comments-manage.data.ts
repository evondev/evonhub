import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCommentsManage } from "../../actions";
import { FetchCommentsManageParams } from "../../types/comment-manage.types";

interface GetCommentsOptionsProps extends FetchCommentsManageParams {
  /** Chỉ để tách cache theo người dùng, server lấy user từ session */
  userId?: string;
  enabled?: boolean;
}

export function getCommentsOptions({
  enabled = true,
  userId,
  ...params
}: GetCommentsOptionsProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchCommentsManage(params),
    queryKey: [
      QUERY_KEYS.GET_COMMENTS,
      params.limit,
      params.page,
      params.search,
      params.status,
      params.courseId,
      userId,
    ],
  });
}

export function useQueryCommentsManage(props: GetCommentsOptionsProps) {
  return useQuery(getCommentsOptions(props));
}
