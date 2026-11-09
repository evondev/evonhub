import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchFeedbacks } from "../../actions";
import { FetchFeedbacksParams } from "../../types";

export function getFeedbacksOptions(params: FetchFeedbacksParams) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: () => fetchFeedbacks(params),
    queryKey: [
      QUERY_KEYS.GET_FEEDBACKS,
      params.limit,
      params.page,
      params.search,
    ],
  });
}

export function useQueryFeedbacks(params: FetchFeedbacksParams) {
  return useQuery(getFeedbacksOptions(params));
}
