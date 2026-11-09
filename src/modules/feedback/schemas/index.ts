import { z } from "zod";
import { FEEDBACK_TEXT_MAX_LENGTH } from "../constants";

const feedbackTextSchema = z
  .string()
  .trim()
  .max(FEEDBACK_TEXT_MAX_LENGTH, {
    message: `Tối đa ${FEEDBACK_TEXT_MAX_LENGTH} ký tự`,
  });

// Chỉ cần điền một trong hai ô. Lỗi gắn vào ô khoá học, ô đứng đầu form
export const feedbackFormSchema = z
  .object({
    courseWish: feedbackTextSchema,
    featureWish: feedbackTextSchema,
  })
  .refine((values) => Boolean(values.courseWish || values.featureWish), {
    message: "Hãy điền ít nhất một ô nhé",
    path: ["courseWish"],
  });
