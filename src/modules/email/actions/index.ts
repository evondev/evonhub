"use server";

import {
  ITEMS_PER_PAGE,
  MAX_RECIPIENTS,
  SEND_EMAIL_DELAY_MS,
} from "@/shared/constants/common.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { resendClient } from "@/shared/libs/resend";
import { EmailStatus } from "@/shared/types/email.types";
import { FilterQuery } from "mongoose";
import EmailModel from "../models";
import {
  EmailItemData,
  FetchEmailsProps,
  HandleSendEmailsProps,
} from "../types";

async function sendEmailBatch(
  emails: string[],
  title: string,
  content: string
) {
  const { error } = await resendClient.batch.send(
    emails.map((email) => ({
      from: `${process.env.EMAIL_FROM}`,
      to: [email],
      subject: title,
      html: content,
    }))
  );

  if (error) throw error;
}

export async function handleSendEmails({
  to,
  title,
  content,
}: HandleSendEmailsProps): Promise<boolean | undefined> {
  await connectToDatabase();
  const emailCreated = await EmailModel.create({
    title,
    content,
    recipients: to,
    status: EmailStatus.Success,
  });

  try {
    for (let i = 0; i < to.length; i += MAX_RECIPIENTS) {
      const batch = to.slice(i, i + MAX_RECIPIENTS);
      await sendEmailBatch(batch, title, content);

      await EmailModel.findOneAndUpdate(
        {
          _id: emailCreated._id,
        },
        {
          $inc: { count: batch.length },
        },
        {
          new: true,
        }
      );
      await new Promise((resolve) => setTimeout(resolve, SEND_EMAIL_DELAY_MS));
    }

    return true;
  } catch (error) {
    console.error(error);
    await EmailModel.findOneAndUpdate(
      {
        _id: emailCreated._id,
      },
      {
        status: EmailStatus.Failed,
      }
    );
  }
}

export async function fetchEmails({
  search,
  page = 1,
  limit = ITEMS_PER_PAGE,
}: FetchEmailsProps): Promise<EmailItemData[] | undefined> {
  try {
    await connectToDatabase();
    const query: FilterQuery<typeof EmailModel> = {};
    const skip = (page - 1) * limit;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    const emails = await EmailModel.find(query).skip(skip).limit(limit).sort({
      createdAt: -1,
    });

    return parseData(emails);
  } catch (error) {
    console.error(error);
  }
}
