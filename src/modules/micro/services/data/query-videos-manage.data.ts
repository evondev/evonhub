import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVideosManage } from "../../actions";

interface GetVideosManageProps {
  enabled?: boolean;
}

export function useQueryVideosManage({
  enabled = true,
  ...props
}: GetVideosManageProps) {
  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchVideosManage();

      return response;
    },
    queryKey: [QUERY_KEYS.GET_MICROS],
  });
}
