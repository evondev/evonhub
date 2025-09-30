import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCommentsManage } from "../../actions";
import { FetchCommentsProps } from "../../types";

interface GetCommentsProps extends FetchCommentsProps {
  enabled?: boolean;
}

export function getCommentsOptions({
  enabled = true,
  ...props
}: GetCommentsProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCommentsManage({ ...props });

      return response;
    },
    queryKey: [
      QUERY_KEYS.GET_COMMENTS,
      props.limit,
      props.page,
      props.search,
      props.status,
      props.userId,
    ],
  });
}

export function useQueryCommentsManage({
  enabled = true,
  ...props
}: GetCommentsProps) {
  const options = getCommentsOptions({ enabled, ...props });

  return useQuery(options);
}
