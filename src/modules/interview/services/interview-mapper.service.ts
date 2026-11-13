import { InterviewQuestionStatus } from "../constants/interview-enums";
import {
  InterviewAdminQuestion,
  InterviewPracticeQuestion,
  InterviewQuestionModelProps,
  InterviewQuestionProgress,
  InterviewQuestionStats,
} from "../types";
import { shuffleBySeed } from "../utils/interview-shuffle.utils";

const EMPTY_QUESTION_STATS: InterviewQuestionStats = { learnerCount: 0, correctCount: 0 };

/** Câu hỏi đầy đủ cho Admin, kể cả đáp án và kết quả học viên làm */
export function toAdminQuestion(
  question: InterviewQuestionModelProps,
  stats: InterviewQuestionStats = EMPTY_QUESTION_STATS,
): InterviewAdminQuestion {
  return {
    id: String(question._id),
    courseId: question.course.toString(),
    type: question.type,
    status: question.status || InterviewQuestionStatus.Draft,
    origin: question.origin,
    difficulty: question.difficulty,
    version: question.version || "",
    prompt: question.prompt,
    code: question.code || "",
    options: (question.options || []).map((option) => ({
      text: option.text,
      isCorrect: Boolean(option.isCorrect),
    })),
    logItems: question.logItems || [],
    explanation: question.explanation || "",
    keyPoints: question.keyPoints || [],
    sources: (question.sources || []).map((source) => ({
      url: source.url,
      title: source.title || "",
      quote: source.quote || "",
      isQuoteVerified: Boolean(source.isQuoteVerified),
    })),
    tags: question.tags || [],
    sourcePages: question.sourcePages || [],
    createdAt: new Date(question.createdAt).toISOString(),
    updatedAt: new Date(question.updatedAt || question.createdAt).toISOString(),
    stats,
  };
}

/**
 * Câu hỏi gửi xuống lúc làm bài: bỏ đáp án, giải thích, ý chính, nguồn. Đáp án và
 * dòng log trộn theo người học, hạt giống là userId + questionId
 */
export function toPracticeQuestion(
  question: InterviewQuestionModelProps,
  userId: string,
  progress: InterviewQuestionProgress,
): InterviewPracticeQuestion {
  const questionId = String(question._id);
  const seed = `${userId}:${questionId}`;
  const options = (question.options || []).map((option) => ({
    id: option._id.toString(),
    text: option.text,
  }));
  const logItems = (question.logItems || []).map((text, index) => ({ index, text }));

  return {
    id: questionId,
    type: question.type,
    difficulty: question.difficulty,
    prompt: question.prompt,
    code: question.code || "",
    version: question.version || "",
    tags: question.tags || [],
    options: shuffleBySeed(options, seed),
    logItems: shuffleBySeed(logItems, `${seed}:log`),
    progress,
  };
}
