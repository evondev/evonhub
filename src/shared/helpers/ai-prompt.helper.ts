import {
  AI_LONG_DESCRIPTION_RULE,
  AI_SHORT_DESCRIPTION_RULE,
} from "@/shared/constants/ai.constants";
import type {
  AiVideoContext,
  SuggestDescriptionInput,
  SuggestTitlesInput,
} from "@/shared/types/ai.types";
import { AuthenticationError, RateLimitError } from "openai";
import { htmlToPlainText } from "./html.helper";

function buildVideoContextText({
  title,
  category,
  level,
  description,
}: AiVideoContext) {
  const lines = [`Tiêu đề: ${title}`];
  const descriptionText = htmlToPlainText(description || "");

  if (category) lines.push(`Danh mục: ${category}`);
  if (level) lines.push(`Trình độ: ${level}`);
  if (descriptionText) {
    lines.push(
      `Mô tả đang có (để biết video nói về gì, không cần giữ câu chữ): ${descriptionText}`,
    );
  }

  return lines.join("\n");
}

export function buildTitlePrompt(
  input: SuggestTitlesInput,
  recentTitles: string[],
) {
  const sections = [buildVideoContextText(input)];

  if (recentTitles.length) {
    const recentTitleLines = recentTitles.map((title) => `- ${title}`);

    sections.push(
      `Tiêu đề các video gần đây của mình (để bắt giọng, không lặp lại):\n${recentTitleLines.join("\n")}`,
    );
  }

  if (input.direction?.trim()) {
    sections.push(`Hướng mình muốn thêm: ${input.direction.trim()}`);
  }

  return sections.join("\n\n");
}

export function buildDescriptionPrompt(input: SuggestDescriptionInput) {
  const lengthRule =
    input.length === "long"
      ? AI_LONG_DESCRIPTION_RULE
      : AI_SHORT_DESCRIPTION_RULE;
  return [buildVideoContextText(input), lengthRule].join("\n\n");
}

export function getAiErrorMessage(error: unknown) {
  if (error instanceof AuthenticationError) {
    return "OPENAI_API_KEY không hợp lệ";
  }

  if (error instanceof RateLimitError) {
    return "OpenAI đang giới hạn lượt gọi hoặc hết quota, thử lại sau nhé";
  }

  return "AI chưa trả lời được, thử lại sau nhé";
}
