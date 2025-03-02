import { z } from "zod";

export const createCouponSchema = z.object({
  title: z.string(),
  code: z.string(),
  amount: z.number(),
  limit: z.number().optional(),
  courses: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  users: z.string().optional(),
});
