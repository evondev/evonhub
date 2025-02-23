import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchCoursesManage } from "../../actions";
import { FetchCoursesManageProps } from "../../types";

interface GetCoursesManageProps extends FetchCoursesManageProps {
  enabled?: boolean;
}

export function getCoursesManageOptions({
  enabled = true,
  ...props
}: GetCoursesManageProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchCoursesManage({ ...props });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_COURSES_MANAGE, props],
  });
}

export function useQueryCoursesManage({
  enabled = true,
  ...props
}: GetCoursesManageProps) {
  const options = getCoursesManageOptions({ enabled, ...props });

  return useQuery(options);
}
