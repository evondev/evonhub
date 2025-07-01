"use server";

import {
  ITEMS_PER_PAGE,
  MAX_RECIPIENTS,
  RATE_LIMIT,
} from "@/shared/constants/common.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { SendEmailCommand, sesClient } from "@/shared/libs/aws-ses";
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
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: emails,
    },
    Message: {
      Subject: {
        Data: title,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: content,
          Charset: "UTF-8",
        },
      },
    },
  };

  const command = new SendEmailCommand(params);
  return sesClient.send(command);
}

export async function handleSendEmails({
  to,
  title,
  content,
}: HandleSendEmailsProps): Promise<boolean | undefined> {
  try {
    connectToDatabase();
    const emailCreated = await EmailModel.create({
      title,
      content,
      recipients: to,
      status: EmailStatus.Success,
    });

    for (let i = 0; i < to.length; i += MAX_RECIPIENTS) {
      const batch = to.slice(i, i + MAX_RECIPIENTS);
      await sendEmailBatch(batch, title, content);

      const delayMs = Math.ceil(batch.length / RATE_LIMIT) * 1000;
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
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchEmails({
  search,
  page = 1,
  limit = ITEMS_PER_PAGE,
}: FetchEmailsProps): Promise<EmailItemData[] | undefined> {
  try {
    connectToDatabase();
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
