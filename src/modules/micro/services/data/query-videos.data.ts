import { MicroStatus } from "@/shared/constants/micro.constant";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVideos } from "../../actions";

interface GetVideosManageProps {
  enabled?: boolean;
  status?: MicroStatus;
}

export function useQueryVideos({
  enabled = true,
  ...props
}: GetVideosManageProps) {
  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchVideos({
        status: props.status,
      });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_MICROS],
  });
}
