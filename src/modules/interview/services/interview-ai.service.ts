import { getOpenAIClient, OPENAI_MODEL } from "@/shared/libs/openai";
import { zodTextFormat } from "openai/helpers/zod";
import { INTERVIEW_AI_INSTRUCTIONS, INTERVIEW_TYPE_LABELS } from "../constants";
import { InterviewQuestionType } from "../constants/interview-enums";
import {
  interviewAiResponseSchema,
  interviewQuestionContentSchema,
} from "../schemas";
import {
  InterviewAdminSource,
  InterviewDocPage,
  InterviewGeneratedQuestion,
} from "../types";
import { pickQuestionContentByType } from "../utils/interview-form.utils";
import { normalizeSourceUrl } from "../utils/interview-source.utils";
import { verifySources } from "./interview-doc.service";

interface GenerateFromDocsParams {
  docPages: InterviewDocPage[];
  courseTitle: string;
  topics: string[];
  types: InterviewQuestionType[];
  count: number;
  hint: string;
  /** Câu hỏi đã có của khoá, để AI không lặp lại */
  existingPrompts: string[];
}

export interface CheckedGeneratedQuestion
  extends Omit<InterviewGeneratedQuestion, "sources"> {
  sources: InterviewAdminSource[];
}

interface GenerateFromDocsResult {
  questions: CheckedGeneratedQuestion[];
  skippedCount: number;
}

function buildGeneratePrompt({
  docPages,
  courseTitle,
  topics,
  types,
  count,
  hint,
  existingPrompts,
}: GenerateFromDocsParams) {
  const typeLines = types.map((type) => `- ${type} (${INTERVIEW_TYPE_LABELS[type]})`);
  const sections = [
    `Khoá học: ${courseTitle}`,
    `Số câu cần tạo: ${count}, trộn đều các dạng:\n${typeLines.join("\n")}`,
  ];

  if (topics.length) sections.push(`Chủ đề tập trung: ${topics.join(", ")}`);
  if (hint.trim()) sections.push(`Gợi ý thêm của Admin: ${hint.trim()}`);
  if (existingPrompts.length) {
    sections.push(
      `Các câu đã có (không lặp lại):\n${existingPrompts.map((prompt) => `- ${prompt}`).join("\n")}`,
    );
  }

  const pageBlocks = docPages.map(
    (docPage, index) => `### Trang ${index + 1}\nurl: ${docPage.url}\ntiêu đề: ${docPage.title}\n\n${docPage.text}`,
  );
  sections.push(`Tài liệu được phép dùng:\n\n${pageBlocks.join("\n\n")}`);

  return sections.join("\n\n");
}

/**
 * Nhờ AI ra đề từ các trang tài liệu rồi kiểm từng câu: đúng cấu trúc, nguồn là
 * một trong các trang đã đưa, đoạn trích có thật trong trang. Câu sai cấu trúc
 * hay nguồn lạ bị bỏ; đoạn trích không khớp thì vẫn giữ, đánh dấu để Admin sửa
 */
export async function generateQuestionsFromDocs(
  params: GenerateFromDocsParams,
): Promise<GenerateFromDocsResult> {
  const response = await getOpenAIClient().responses.parse({
    model: OPENAI_MODEL,
    // Đoán output là dạng AI hay sai nhất (batching, StrictMode, microtask): cho nghĩ kỹ hơn
    reasoning: { effort: "medium" },
    instructions: INTERVIEW_AI_INSTRUCTIONS,
    input: buildGeneratePrompt(params),
    text: {
      format: zodTextFormat(interviewAiResponseSchema, "interview_questions"),
    },
  });
  const generatedQuestions = response.output_parsed?.questions || [];
  const allowedUrls = new Set(params.docPages.map((docPage) => docPage.url));
  const checkedQuestions: CheckedGeneratedQuestion[] = [];

  for (const generatedQuestion of generatedQuestions.slice(0, params.count)) {
    const parsedQuestion = interviewQuestionContentSchema.safeParse(
      pickQuestionContentByType(generatedQuestion),
    );

    if (!parsedQuestion.success) continue;

    const knownSources = parsedQuestion.data.sources.filter((source) =>
      allowedUrls.has(normalizeSourceUrl(source.url)),
    );

    if (!knownSources.length) continue;

    checkedQuestions.push({
      ...parsedQuestion.data,
      sources: await verifySources(knownSources, params.docPages),
    });
  }

  return {
    questions: checkedQuestions,
    skippedCount: Math.min(generatedQuestions.length, params.count) - checkedQuestions.length,
  };
}
