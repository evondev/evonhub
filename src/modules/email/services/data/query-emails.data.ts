import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchEmails } from "../../actions";
import { FetchEmailsProps } from "../../types";

interface GetEmailsProps extends FetchEmailsProps {
  enabled?: boolean;
}

export function getEmailsOptions({ enabled = true, ...props }: GetEmailsProps) {
  return queryOptions({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetchEmails({ ...props });

      return response;
    },
    queryKey: [QUERY_KEYS.GET_EMAILS, props],
  });
}

export function useQueryEmails({ enabled, ...props }: GetEmailsProps) {
  const options = getEmailsOptions({ enabled, ...props });

  return useQuery(options);
}
