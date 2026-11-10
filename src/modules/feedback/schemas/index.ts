import { z } from "zod";
import { FEEDBACK_TEXT_MAX_LENGTH } from "../constants";

const feedbackTextSchema = z
  .string()
  .trim()
  .max(FEEDBACK_TEXT_MAX_LENGTH, {
    message: `Tối đa ${FEEDBACK_TEXT_MAX_LENGTH} ký tự`,
  });

// Chỉ cần trả lời một trong bốn câu. Lỗi gắn vào ô khoá học, câu đứng đầu form
export const feedbackFormSchema = z
  .object({
    courseWish: feedbackTextSchema,
    featureWish: feedbackTextSchema,
    aiCourseOpinion: feedbackTextSchema,
    wantsEnglish: z.boolean().optional(),
  })
  .refine(
    (values) =>
      Boolean(
        values.courseWish || values.featureWish || values.aiCourseOpinion,
      ) || typeof values.wantsEnglish === "boolean",
    {
      message: "Hãy trả lời ít nhất một câu nhé",
      path: ["courseWish"],
    },
  );
