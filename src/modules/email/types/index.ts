import { EmailModelProps } from "@/shared/types/email.types";
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
export interface EmailItemData extends EmailModelProps {}

export interface OrderApprovedEmailData {
  code: string;
  username: string;
  total: number;
  courseTitle?: string;
  plan?: string;
}

export interface OrderCreatedEmailData {
  code: string;
  username: string;
  total: number;
  qrUrl: string;
  courseTitle?: string;
}

export interface OrderReminderEmailData {
  code: string;
  username: string;
  total: number;
  remainingTime: string;
  qrUrl: string;
  courseTitle?: string;
}

export interface SendTransactionalEmailProps {
  to: string;
  subject: string;
  html: string;
}
