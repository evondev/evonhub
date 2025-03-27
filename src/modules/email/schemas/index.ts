import { z } from "zod";

export const sendEmailSchema = z.object({
  title: z.string({
    message: "Tiêu đề không được để trống",
  }),
  content: z.string({
    message: "Tiêu đề không được để trống",
  }),
});
