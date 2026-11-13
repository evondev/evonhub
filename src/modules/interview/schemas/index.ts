import { z } from "zod";
import {
  INTERVIEW_KEY_POINT_LIMITS,
  INTERVIEW_LOG_ITEM_LIMITS,
  INTERVIEW_OPTION_LIMITS,
  INTERVIEW_SOURCE_LIMIT,
  INTERVIEW_TAG_LIMIT,
  INTERVIEW_TEXT_LIMITS,
} from "../constants";
import {
  InterviewDifficulty,
  InterviewQuestionType,
} from "../constants/interview-enums";
import { isAllowedSourceUrl } from "../utils/interview-source.utils";

const trimmedText = (maxLength: number) => z.string().trim().max(maxLength);

const sourceSchema = z.object({
  url: z
    .string()
    .trim()
    .refine(isAllowedSourceUrl, {
      message:
        "Nguồn chỉ nhận link https của react.dev, nextjs.org, developer.mozilla.org, typescriptlang.org",
    }),
  title: trimmedText(200),
  quote: trimmedText(INTERVIEW_TEXT_LIMITS.quote),
});

/** Nội dung một câu hỏi, dùng chung cho Admin lưu và câu AI tạo */
export const interviewQuestionContentSchema = z
  .object({
    type: z.nativeEnum(InterviewQuestionType),
    difficulty: z.nativeEnum(InterviewDifficulty),
    version: trimmedText(INTERVIEW_TEXT_LIMITS.version),
    prompt: trimmedText(INTERVIEW_TEXT_LIMITS.prompt).min(1, {
      message: "Câu hỏi không được để trống",
    }),
    code: z.string().max(INTERVIEW_TEXT_LIMITS.code, {
      message: "Code dài quá, giữ khoảng 15 dòng thôi",
    }),
    options: z
      .array(
        z.object({
          text: trimmedText(INTERVIEW_TEXT_LIMITS.option),
          isCorrect: z.boolean(),
        }),
      )
      .max(INTERVIEW_OPTION_LIMITS.max),
    logItems: z
      .array(trimmedText(INTERVIEW_TEXT_LIMITS.logItem))
      .max(INTERVIEW_LOG_ITEM_LIMITS.max),
    explanation: trimmedText(INTERVIEW_TEXT_LIMITS.explanation).min(1, {
      message: "Phần giải thích không được để trống",
    }),
    keyPoints: z
      .array(trimmedText(INTERVIEW_TEXT_LIMITS.keyPoint))
      .transform((keyPoints) => keyPoints.filter(Boolean))
      .pipe(
        z
          .array(z.string())
          .min(INTERVIEW_KEY_POINT_LIMITS.min, {
            message: "Cần ít nhất một ý chính để học viên tự đối chiếu",
          })
          .max(INTERVIEW_KEY_POINT_LIMITS.max, {
            message: "Tối đa 3 ý chính",
          }),
      ),
    sources: z
      .array(sourceSchema)
      .min(1, { message: "Cần ít nhất một nguồn chính chủ" })
      .max(INTERVIEW_SOURCE_LIMIT),
    tags: z
      .array(trimmedText(INTERVIEW_TEXT_LIMITS.tag))
      .transform((tags) => [...new Set(tags.filter(Boolean))])
      .pipe(z.array(z.string()).max(INTERVIEW_TAG_LIMIT)),
  })
  .superRefine((values, context) => {
    if (values.type === InterviewQuestionType.LogOrder) {
      const filledLogItems = values.logItems.filter(Boolean);

      if (
        filledLogItems.length < INTERVIEW_LOG_ITEM_LIMITS.min ||
        filledLogItems.length !== values.logItems.length
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["logItems"],
          message: "Cần ít nhất 3 dòng log, không để dòng trống",
        });
      }

      return;
    }

    const filledOptions = values.options.filter((option) => option.text);
    const correctOptions = values.options.filter((option) => option.isCorrect);

    if (
      filledOptions.length < INTERVIEW_OPTION_LIMITS.min ||
      filledOptions.length !== values.options.length
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Cần 2–4 đáp án, không để đáp án trống",
      });
    }

    if (correctOptions.length !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Chọn đúng một đáp án đúng",
      });
    }
  });

export const interviewQuestionFormSchema = interviewQuestionContentSchema.and(
  z.object({ courseId: z.string().min(1, { message: "Chọn khoá học" }) }),
);

export const submitInterviewAnswerSchema = z.object({
  questionId: z.string(),
  selectedOptionId: z.string().optional(),
  logOrder: z.array(z.number().int().min(0)).max(INTERVIEW_LOG_ITEM_LIMITS.max).optional(),
  explanationText: z.string().max(INTERVIEW_TEXT_LIMITS.studentExplanation),
});

export const saveInterviewKeyPointsSchema = z.object({
  attemptId: z.string(),
  coveredKeyPoints: z
    .array(z.number().int().min(0).max(INTERVIEW_KEY_POINT_LIMITS.max - 1))
    .max(INTERVIEW_KEY_POINT_LIMITS.max),
});

/** Khuôn AI phải trả về. Structured output của OpenAI: trường nào cũng bắt buộc */
export const interviewAiResponseSchema = z.object({
  questions: z.array(
    z.object({
      type: z.enum([
        InterviewQuestionType.Predict,
        InterviewQuestionType.LogOrder,
        InterviewQuestionType.Concept,
      ]),
      difficulty: z.enum([
        InterviewDifficulty.Easy,
        InterviewDifficulty.Medium,
        InterviewDifficulty.Hard,
      ]),
      prompt: z.string(),
      code: z.string(),
      options: z.array(z.object({ text: z.string(), isCorrect: z.boolean() })),
      logItems: z.array(z.string()),
      explanation: z.string(),
      keyPoints: z.array(z.string()),
      sources: z.array(
        z.object({ url: z.string(), title: z.string(), quote: z.string() }),
      ),
      version: z.string(),
      tags: z.array(z.string()),
    }),
  ),
});
