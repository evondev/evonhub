import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchInterviewQuestions } from "../../actions";
import { FetchInterviewQuestionsParams } from "../../types";

export function getInterviewQuestionsOptions(
  params: FetchInterviewQuestionsParams,
) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: () => fetchInterviewQuestions(params),
    queryKey: [
      QUERY_KEYS.GET_INTERVIEW_QUESTIONS,
      params.courseId,
      params.tab,
      params.search,
    ],
  });
}

export function useQueryInterviewQuestions(
  params: FetchInterviewQuestionsParams,
) {
  return useQuery(getInterviewQuestionsOptions(params));
}
