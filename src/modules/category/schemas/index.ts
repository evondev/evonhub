import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Tên danh mục phải có ít nhất 2 ký tự" }),
  slug: z.string().optional(),
});
