import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { useMutation } from "@tanstack/react-query";
import { handleSendEmails } from "../../actions";

export function userMutationSendEmails() {
  return useMutation({
    mutationFn: handleSendEmails,
    mutationKey: [QUERY_KEYS.HANDLE_SEND_EMAILS],
    onSuccess: () => {},
  });
}
