import { z } from "zod";

export const updateLessonSchema = z.object({
  video: z.string().optional(),
  content: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  duration: z.number().optional(),
  assetId: z.string().optional(),
  iframe: z.string().optional(),
  trial: z.boolean().optional(),
});
export type UpdateLessonValues = z.infer<typeof updateLessonSchema>;
