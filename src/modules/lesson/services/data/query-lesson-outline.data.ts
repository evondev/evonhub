import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchLessonDetailsOutline } from "../../actions";

interface GetLessonDetailsOutlineProps {
  slug: string;
}

export function getLessonDetailsOutlineOptions({
  slug,
}: GetLessonDetailsOutlineProps) {
  return queryOptions({
    enabled: !!slug,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchLessonDetailsOutline(slug);

      return response;
    },
    queryKey: [QUERY_KEYS.GET_LESSON_DETAILS_OUTLINE, slug],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useQueryLessonDetailsOutline({
  slug,
}: GetLessonDetailsOutlineProps) {
  const options = getLessonDetailsOutlineOptions({ slug });

  return useQuery(options);
}
