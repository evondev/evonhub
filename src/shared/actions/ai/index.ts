"use server";

import CourseModel from "@/modules/course/models";
import {
  AI_DESCRIPTION_INSTRUCTIONS,
  AI_EMPTY_RESULT_MESSAGE,
  AI_EMPTY_TITLE_MESSAGE,
  AI_MISSING_KEY_MESSAGE,
  AI_PERMISSION_MESSAGE,
  AI_RECENT_TITLE_LIMIT,
  AI_TITLE_INSTRUCTIONS,
  AI_TITLE_SUGGESTION_COUNT,
  AI_VOICE_GUIDE,
} from "@/shared/constants/ai.constants";
import { CourseType } from "@/shared/constants/course.constants";
import {
  buildDescriptionPrompt,
  buildTitlePrompt,
  getAiErrorMessage,
} from "@/shared/helpers/ai-prompt.helper";
import { sanitizeHtml } from "@/shared/helpers/html.helper";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentAdmin } from "@/shared/libs/auth";
import { getOpenAIClient, OPENAI_MODEL } from "@/shared/libs/openai";
import type {
  AiActionResult,
  AiTitleSuggestion,
  SuggestDescriptionInput,
  SuggestTitlesInput,
} from "@/shared/types/ai.types";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const titleSuggestionsSchema = z.object({
  titles: z.array(z.object({ title: z.string(), hook: z.string() })),
});

const descriptionSchema = z.object({ html: z.string() });

/** Lý do không gọi được AI, null là gọi được */
async function checkAiAccess() {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) return AI_PERMISSION_MESSAGE;
  if (!process.env.OPENAI_API_KEY) return AI_MISSING_KEY_MESSAGE;

  return null;
}

async function fetchRecentVideoTitles(excludedTitle: string) {
  await connectToDatabase();

  const videos = await CourseModel.find({
    type: CourseType.Video,
    _destroy: false,
  })
    .select("title")
    .sort({ createdAt: -1 })
    .limit(AI_RECENT_TITLE_LIMIT + 1)
    .lean();

  return videos
    .map((video) => video.title)
    .filter((title) => title !== excludedTitle)
    .slice(0, AI_RECENT_TITLE_LIMIT);
}

export async function suggestVideoTitles(
  input: SuggestTitlesInput,
): Promise<AiActionResult<AiTitleSuggestion[]>> {
  try {
    const accessError = await checkAiAccess();

    if (accessError) return { type: "error", message: accessError };

    const title = input.title.trim();

    if (!title) return { type: "error", message: AI_EMPTY_TITLE_MESSAGE };

    const recentTitles = await fetchRecentVideoTitles(title);
    const response = await getOpenAIClient().responses.parse({
      model: OPENAI_MODEL,
      reasoning: { effort: "low" },
      instructions: `${AI_VOICE_GUIDE}\n\n${AI_TITLE_INSTRUCTIONS}`,
      input: buildTitlePrompt({ ...input, title }, recentTitles),
      text: {
        format: zodTextFormat(titleSuggestionsSchema, "title_suggestions"),
      },
    });
    const normalizedTitle = title.toLowerCase();
    const suggestions = response.output_parsed?.titles
      .filter(
        (suggestion) =>
          suggestion.title.trim().toLowerCase() !== normalizedTitle,
      )
      .slice(0, AI_TITLE_SUGGESTION_COUNT);

    if (!suggestions?.length) {
      return { type: "error", message: AI_EMPTY_RESULT_MESSAGE };
    }

    return { type: "success", data: suggestions };
  } catch (error) {
    console.log(error);

    return { type: "error", message: getAiErrorMessage(error) };
  }
}

export async function suggestVideoDescription(
  input: SuggestDescriptionInput,
): Promise<AiActionResult<string>> {
  try {
    const accessError = await checkAiAccess();

    if (accessError) return { type: "error", message: accessError };

    const title = input.title.trim();

    if (!title) return { type: "error", message: AI_EMPTY_TITLE_MESSAGE };

    const response = await getOpenAIClient().responses.parse({
      model: OPENAI_MODEL,
      reasoning: { effort: "low" },
      instructions: `${AI_VOICE_GUIDE}\n\n${AI_DESCRIPTION_INSTRUCTIONS}`,
      input: buildDescriptionPrompt({ ...input, title }),
      text: { format: zodTextFormat(descriptionSchema, "video_description") },
    });
    // Sẽ đổ thẳng vào TinyMCE và hiện ra trang public
    const descriptionHtml = sanitizeHtml(response.output_parsed?.html || "");

    if (!descriptionHtml.trim()) {
      return { type: "error", message: AI_EMPTY_RESULT_MESSAGE };
    }

    return { type: "success", data: descriptionHtml };
  } catch (error) {
    console.log(error);

    return { type: "error", message: getAiErrorMessage(error) };
  }
}
