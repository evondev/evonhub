"use server";

import { connectToDatabase } from "@/shared/libs";
import { SendEmailCommand, sesClient } from "@/shared/libs/aws-ses";
import { HandleSendEmailsProps } from "../types";

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
    return response;
  } catch (error) {}
}
