import {
  InterviewDifficulty,
  InterviewQuestionType,
} from "../constants/interview-enums";
import { InterviewAdminQuestion, InterviewQuestionFormValues } from "../types";

/** Dạng chọn đáp án (đoán kết quả, khái niệm), khác dạng sắp xếp log */
export function isChoiceQuestionType(type: InterviewQuestionType): boolean {
  return type !== InterviewQuestionType.LogOrder;
}

export function createEmptyQuestionValues(
  courseId: string,
): InterviewQuestionFormValues {
  return {
    courseId,
    type: InterviewQuestionType.Predict,
    difficulty: InterviewDifficulty.Medium,
    version: "",
    prompt: "",
    code: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    logItems: ["", "", ""],
    explanation: "",
    keyPoints: ["", ""],
    sources: [{ url: "", title: "", quote: "" }],
    tags: [],
  };
}

export function toQuestionFormValues(
  question: InterviewAdminQuestion,
): InterviewQuestionFormValues {
  const emptyValues = createEmptyQuestionValues(question.courseId);

  return {
    courseId: question.courseId,
    type: question.type,
    difficulty: question.difficulty,
    version: question.version,
    prompt: question.prompt,
    code: question.code,
    // Đổi dạng bài trong form thì phần của dạng kia vẫn có ô để điền
    options: question.options.length ? question.options : emptyValues.options,
    logItems: question.logItems.length ? question.logItems : emptyValues.logItems,
    explanation: question.explanation,
    keyPoints: question.keyPoints.length ? question.keyPoints : emptyValues.keyPoints,
    sources: question.sources.length
      ? question.sources.map(({ url, title, quote }) => ({ url, title, quote }))
      : emptyValues.sources,
    tags: question.tags,
  };
}

/** Bỏ phần của dạng bài không dùng trước khi lưu */
export function pickQuestionContentByType<
  TValues extends Pick<InterviewQuestionFormValues, "type" | "options" | "logItems">,
>(values: TValues): TValues {
  if (isChoiceQuestionType(values.type)) return { ...values, logItems: [] };

  return { ...values, options: [] };
}
