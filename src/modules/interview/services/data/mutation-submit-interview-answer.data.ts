import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { useMutation } from "@tanstack/react-query";
import { submitInterviewAnswer } from "../../actions";
import { SubmitInterviewAnswerHandler } from "../../types";

/** Trang xem trước truyền hàm chấm tại chỗ thay cho server action */
export function useMutationSubmitInterviewAnswer(
  submitHandler: SubmitInterviewAnswerHandler = submitInterviewAnswer,
) {
  return useMutation({
    mutationFn: submitHandler,
    mutationKey: [QUERY_KEYS.HANDLE_SUBMIT_INTERVIEW_ANSWER],
  });
}
