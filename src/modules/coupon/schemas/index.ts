import { z } from "zod";

export const createCouponSchema = z.object({
  title: z.string({
    message: "Tiêu đề không được để trống",
  }),
  code: z
    .string({
      message: "Mã giảm giá không được để trống",
    })
    .min(6, { message: "Mã giảm giá phải có ít nhất 6 ký tự" }),
  amount: z.string({
    message: "Số tiền không được để trống",
  }),
  limit: z.number().optional(),
  courses: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  users: z.array(z.string()).optional(),
});
