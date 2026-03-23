import { MicroStatus } from "@/shared/constants/micro.constant";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVideoBySlug } from "../../actions";

interface GetVideoBySlugProps {
  slug: string;
  status?: MicroStatus;
  enabled?: boolean;
}

export function useQueryVideoBySlug({
  slug,
  status,
  enabled = true,
}: GetVideoBySlugProps) {
  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchVideoBySlug(slug);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_MICRO_BY_SLUG, slug, status],
  });
}
