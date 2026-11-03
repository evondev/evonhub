import { EMBED_VIDEO_INVALID_MESSAGE } from "@/shared/constants/lesson.constants";
import { isValidEmbedVideoInput } from "@/shared/utils/video-embed.utils";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { z } from "zod";

export const updateCourseSchema = z.object({
  title: z.string().min(10, {
    message: "Tiêu đề phải có ít nhất 10 ký tự",
  }),
  slug: z.string().optional(),
  cta: z.string().optional(),
  ctaLink: z.string().optional(),
  price: z.string().optional(),
  salePrice: z.string().optional(),
  intro: z.string().optional(),
  image: z.string().optional(),
  desc: z.string().optional(),
  content: z.string().optional(),
  level: z
    .enum([ECourseLevel.EASY, ECourseLevel.MEDIUM, ECourseLevel.EXPERT])
    .optional(),
  category: z.string().optional(),
  status: z
    .enum([
      ECourseStatus.PENDING,
      ECourseStatus.APPROVED,
      ECourseStatus.REJECTED,
      ECourseStatus.ARCHIVED,
    ])
    .optional(),
  qa: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
  requirements: z.array(z.string()).optional(),
  gained: z.array(z.string()).optional(),
  seoKeywords: z.string().optional(),
  free: z.boolean().optional(),
});
export const createVideoSchema = updateCourseSchema.pick({
  title: true,
  slug: true,
});
// Video lẻ: phần thông tin bán lấy từ form khóa học, phần video và nội dung là của bài học duy nhất
export const updateVideoSchema = updateCourseSchema
  .pick({
    title: true,
    slug: true,
    cta: true,
    price: true,
    salePrice: true,
    intro: true,
    image: true,
    desc: true,
    level: true,
    category: true,
    status: true,
    seoKeywords: true,
    free: true,
  })
  .extend({
    video: z.string(),
    assetId: z.string(),
    iframe: z.string().refine(isValidEmbedVideoInput, {
      message: EMBED_VIDEO_INVALID_MESSAGE,
    }),
    content: z.string(),
    duration: z.coerce.number().min(0),
  });
export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  bank: z
    .object({
      bankName: z.string().optional(),
      bankAccount: z.string().optional(),
      bankNumber: z.string().optional(),
      bankBranch: z.string().optional(),
    })
    .optional(),
});

