import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchUsers } from "../../actions";
import { FetchUsersProps } from "../../types";

interface GetUsersProps extends FetchUsersProps {
  enabled?: boolean;
}

export function getUsersOptions({ enabled = true, ...props }: GetUsersProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchUsers({ ...props });

      return response;
    },
    queryKey: [
      QUERY_KEYS.GET_USERS,
      props.isPaid,
      props.limit,
      props.page,
      props.search,
    ],
  });
}

export function useQueryUsers({ enabled, ...props }: GetUsersProps) {
  const options = getUsersOptions({ enabled, ...props });

  return useQuery(options);
}
