import { z } from "zod";
import { sendEmailSchema } from "../schemas";

export type SendEmailFormValues = z.infer<typeof sendEmailSchema>;
export interface HandleSendEmailsProps {
  to: string[];
  title: string;
  content: string;
}
export interface FetchEmailsProps {
  search?: string;
  limit: number;
  page: number;
}
