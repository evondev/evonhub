import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { IS_PUSHER_CONFIGURED } from "@/shared/libs/pusher/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchMySupportThread } from "../../actions";
import { SUPPORT_POLL_INTERVAL_MS } from "../../constants";

export const MY_SUPPORT_THREAD_QUERY_KEY = [QUERY_KEYS.GET_MY_SUPPORT_THREAD];

export function getMySupportThreadOptions() {
  return queryOptions({
    queryKey: MY_SUPPORT_THREAD_QUERY_KEY,
    queryFn: () => fetchMySupportThread(),
    // Có Pusher thì chờ tín hiệu; chưa cấu hình (dev) thì hỏi theo nhịp
    refetchInterval: IS_PUSHER_CONFIGURED ? false : SUPPORT_POLL_INTERVAL_MS,
  });
}

export function useQueryMySupportThread() {
  return useQuery(getMySupportThreadOptions());
}
