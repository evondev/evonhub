import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { IS_PUSHER_CONFIGURED } from "@/shared/libs/pusher/client";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchSupportInbox } from "../../actions";
import { SUPPORT_POLL_INTERVAL_MS } from "../../constants";
import { SupportInboxFilter } from "../../types";

export function getSupportInboxOptions(filter: SupportInboxFilter) {
  return queryOptions({
    queryKey: [QUERY_KEYS.GET_SUPPORT_INBOX, filter],
    queryFn: () => fetchSupportInbox(filter),
    placeholderData: keepPreviousData,
    refetchInterval: IS_PUSHER_CONFIGURED ? false : SUPPORT_POLL_INTERVAL_MS,
  });
}

export function useQuerySupportInbox(filter: SupportInboxFilter) {
  return useQuery(getSupportInboxOptions(filter));
}
