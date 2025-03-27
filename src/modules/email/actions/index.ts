"use server";

import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
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

export async function handleSendEmails({
  to,
  title,
  content,
}: HandleSendEmailsProps) {
  try {
    connectToDatabase();

    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: to,
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
    const response = await sesClient.send(command);
    let emailStatus = EmailStatus.Success;
    if (response?.$metadata?.httpStatusCode !== 200) {
      emailStatus = EmailStatus.Failed;
    }

    await EmailModel.create({
      title,
      content,
      recipients: to,
      status: emailStatus,
    });

    return response;
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
