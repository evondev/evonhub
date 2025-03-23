import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchRatings } from "../../actions";
import { FetchRatingManageProps } from "../../types";

interface GetRatingsProps extends FetchRatingManageProps {
  enabled?: boolean;
}

export function getRatingsOptions({ enabled, ...props }: GetRatingsProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchRatings({ ...props });
      return response;
    },
    queryKey: [QUERY_KEYS.GET_RATINGS, props],
  });
}

export function useQueryRatings({ enabled, ...props }: GetRatingsProps) {
  const options = getRatingsOptions({ enabled, ...props });

  return useQuery(options);
}
