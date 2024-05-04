import { z } from "zod";

export const updateCourseSchema = z.object({
  title: z.string().min(10, {
    message: "Tiêu đề phải có ít nhất 10 ký tự",
  }),
  slug: z.string().optional(),
  price: z.string().optional(),
  salePrice: z.string().optional(),
  intro: z.string().optional(),
  image: z.string().optional(),
  desc: z.string().optional(),
  content: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  qa: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
  requirements: z.array(z.string()).optional(),
  gained: z.array(z.string()).optional(),
});
