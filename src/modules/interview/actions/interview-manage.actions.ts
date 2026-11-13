"use server";

import CourseModel from "@/modules/course/models";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentAdmin } from "@/shared/libs/auth";
import { escapeRegExp } from "lodash";
import { FilterQuery, isValidObjectId, Types } from "mongoose";
import { z } from "zod";
import {
  INTERVIEW_AI_COUNT_OPTIONS,
  INTERVIEW_AI_PAGE_LIMIT,
  INTERVIEW_TEXT_LIMITS,
} from "../constants";
import {
  InterviewQuestionOrigin,
  InterviewQuestionStatus,
  InterviewQuestionType,
} from "../constants/interview-enums";
import { InterviewAttemptModel, InterviewQuestionModel } from "../models";
import { interviewQuestionFormSchema } from "../schemas";
import { generateQuestionsFromDocs } from "../services/interview-ai.service";
import { fetchDocPages, verifySources } from "../services/interview-doc.service";
import { toAdminQuestion } from "../services/interview-mapper.service";
import {
  FetchInterviewQuestionsParams,
  FetchInterviewQuestionsResult,
  GenerateInterviewQuestionsInput,
  GenerateInterviewQuestionsResult,
  InterviewActionResult,
  InterviewQuestionModelProps,
  InterviewQuestionStats,
  InterviewTabCounts,
  RegenerateInterviewQuestionResult,
  SaveInterviewQuestionInput,
  SaveInterviewQuestionResult,
} from "../types";
import { isAllowedSourceUrl, pickQuestionContentByType } from "../utils";

type InterviewQuestionQuery = FilterQuery<InterviewQuestionModelProps>;

interface StatusCountRow {
  _id: InterviewQuestionStatus;
  count: number;
}

interface QuestionStatsRow extends InterviewQuestionStats {
  _id: Types.ObjectId;
}

const MANAGE_QUESTION_LIMIT = 200;

const EXISTING_PROMPT_LIMIT = 40;

const generateInputSchema = z.object({
  courseId: z.string().refine(isValidObjectId, { message: "Chọn khoá học" }),
  topics: z.array(z.string().trim().max(INTERVIEW_TEXT_LIMITS.tag)).max(10),
  types: z.array(z.nativeEnum(InterviewQuestionType)).min(1, {
    message: "Chọn ít nhất một dạng bài",
  }),
  count: z.number().refine((count) => INTERVIEW_AI_COUNT_OPTIONS.includes(count)),
  pageUrls: z
    .array(
      z.string().trim().refine(isAllowedSourceUrl, {
        message: "Trang tài liệu phải là link https của nguồn chính chủ",
      }),
    )
    .min(1, { message: "Thêm ít nhất một trang tài liệu" })
    .max(INTERVIEW_AI_PAGE_LIMIT),
  hint: z.string().max(500),
});

function getAiAccessError() {
  if (!process.env.OPENAI_API_KEY) return "Chưa cấu hình OPENAI_API_KEY";

  return null;
}

/** Danh sách câu hỏi cho trang Admin, kèm số câu từng tab. Không phải Admin thì undefined */
export async function fetchInterviewQuestions({
  courseId,
  tab,
  search,
}: FetchInterviewQuestionsParams): Promise<FetchInterviewQuestionsResult | undefined> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return;

    await connectToDatabase();

    const baseQuery: InterviewQuestionQuery = {};

    if (typeof courseId === "string" && courseId) {
      if (!isValidObjectId(courseId)) return { questions: [], tabCounts: { draft: 0, published: 0, all: 0 } };

      baseQuery.course = courseId;
    }

    const keyword = typeof search === "string" ? search.trim() : "";

    if (keyword) {
      const keywordRegex = { $regex: escapeRegExp(keyword), $options: "i" };
      baseQuery.$or = [{ prompt: keywordRegex }, { tags: keywordRegex }];
    }

    const isKnownStatus = Object.values(InterviewQuestionStatus).includes(
      tab as InterviewQuestionStatus,
    );
    const listQuery = isKnownStatus ? { ...baseQuery, status: tab } : baseQuery;
    const [questions, statusCounts] = await Promise.all([
      InterviewQuestionModel.find(listQuery).sort({ _id: -1 }).limit(MANAGE_QUESTION_LIMIT),
      InterviewQuestionModel.aggregate<StatusCountRow>([
        { $match: baseQuery },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);
    const statsRows = await InterviewAttemptModel.aggregate<QuestionStatsRow>([
      {
        $match: {
          question: { $in: questions.map((question: InterviewQuestionModelProps) => question._id) },
          isFirstAttempt: true,
        },
      },
      {
        $group: {
          _id: "$question",
          learnerCount: { $sum: 1 },
          correctCount: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
    ]);
    // Chỉ lấy hai con số: ObjectId trong _id không gửi xuống client được
    const statsByQuestionId = new Map<string, InterviewQuestionStats>(
      statsRows.map((statsRow) => [
        statsRow._id.toString(),
        { learnerCount: statsRow.learnerCount, correctCount: statsRow.correctCount },
      ]),
    );
    const tabCounts: InterviewTabCounts = { draft: 0, published: 0, all: 0 };

    for (const statusCount of statusCounts) {
      if (statusCount._id === InterviewQuestionStatus.Draft) tabCounts.draft = statusCount.count;
      if (statusCount._id === InterviewQuestionStatus.Published) tabCounts.published = statusCount.count;
      tabCounts.all += statusCount.count;
    }

    return {
      questions: questions.map((question: InterviewQuestionModelProps) =>
        toAdminQuestion(question, statsByQuestionId.get(String(question._id))),
      ),
      tabCounts,
    };
  } catch (error) {
    console.log("error:", error);
  }
}

/** Admin tạo hoặc sửa một câu; kiểm lại đoạn trích của từng nguồn trước khi lưu */
export async function saveInterviewQuestion({
  questionId,
  values,
  shouldPublish,
}: SaveInterviewQuestionInput): Promise<SaveInterviewQuestionResult> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return { isSuccess: false, message: "Bạn không có quyền" };

    const parsedValues = interviewQuestionFormSchema.safeParse(
      pickQuestionContentByType(values),
    );

    if (!parsedValues.success) {
      return { isSuccess: false, message: parsedValues.error.issues[0]?.message };
    }

    if (questionId && !isValidObjectId(questionId)) {
      return { isSuccess: false, message: "Câu hỏi không hợp lệ" };
    }

    await connectToDatabase();

    const { courseId, sources, ...content } = parsedValues.data;

    if (!isValidObjectId(courseId) || !(await CourseModel.exists({ _id: courseId, _destroy: false }))) {
      return { isSuccess: false, message: "Khoá học không còn nữa" };
    }

    const statusChanges = shouldPublish
      ? { status: InterviewQuestionStatus.Published, publishedAt: new Date() }
      : {};
    const questionValues = {
      ...content,
      course: courseId,
      sources: await verifySources(sources),
      ...statusChanges,
    };
    const savedQuestion = questionId
      ? await InterviewQuestionModel.findByIdAndUpdate(questionId, questionValues, { new: true })
      : await InterviewQuestionModel.create({
          ...questionValues,
          origin: InterviewQuestionOrigin.Manual,
          createdBy: currentAdmin._id,
        });

    if (!savedQuestion) return { isSuccess: false, message: "Câu hỏi không còn nữa" };

    return { isSuccess: true, question: toAdminQuestion(savedQuestion) };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false, message: "Chưa lưu được, thử lại sau nhé" };
  }
}

/** Gỡ một câu đã đăng về nháp: học viên không thấy nữa, điểm cũ vẫn giữ */
export async function unpublishInterviewQuestion(
  questionId: string,
): Promise<InterviewActionResult> {
  try {
    if (typeof questionId !== "string" || !isValidObjectId(questionId)) return { isSuccess: false };

    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return { isSuccess: false };

    await connectToDatabase();

    const updatedQuestion = await InterviewQuestionModel.findByIdAndUpdate(questionId, {
      status: InterviewQuestionStatus.Draft,
    });

    return { isSuccess: Boolean(updatedQuestion) };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false };
  }
}

/** Xoá một câu và mọi lượt làm của nó (điểm của câu đó cũng mất) */
export async function deleteInterviewQuestion(
  questionId: string,
): Promise<InterviewActionResult> {
  try {
    if (typeof questionId !== "string" || !isValidObjectId(questionId)) return { isSuccess: false };

    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return { isSuccess: false };

    await connectToDatabase();

    const deletedQuestion = await InterviewQuestionModel.findByIdAndDelete(questionId);

    if (deletedQuestion) await InterviewAttemptModel.deleteMany({ question: questionId });

    return { isSuccess: Boolean(deletedQuestion) };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false };
  }
}

/** Câu hỏi đã có của khoá, gửi kèm prompt để AI không lặp lại */
async function fetchExistingPrompts(courseId: string, excludedQuestionId?: string) {
  const existingQuestions = await InterviewQuestionModel.find({
    course: courseId,
    ...(excludedQuestionId && { _id: { $ne: excludedQuestionId } }),
  })
    .select("prompt")
    .sort({ _id: -1 })
    .limit(EXISTING_PROMPT_LIMIT)
    .lean<{ prompt: string }[]>();

  return existingQuestions.map((question) => question.prompt);
}

/** AI tạo một lô câu nháp từ các trang tài liệu chính chủ Admin chọn */
export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput,
): Promise<GenerateInterviewQuestionsResult> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return { isSuccess: false, message: "Bạn không có quyền" };

    const aiAccessError = getAiAccessError();

    if (aiAccessError) return { isSuccess: false, message: aiAccessError };

    const parsedInput = generateInputSchema.safeParse(input);

    if (!parsedInput.success) {
      return { isSuccess: false, message: parsedInput.error.issues[0]?.message };
    }

    await connectToDatabase();

    const { courseId, topics, types, count, pageUrls, hint } = parsedInput.data;
    const course = await CourseModel.findOne({ _id: courseId, _destroy: false })
      .select("title")
      .lean<{ title: string }>();

    if (!course) return { isSuccess: false, message: "Khoá học không còn nữa" };

    const docPages = await fetchDocPages(pageUrls);

    if (!docPages.length) {
      return { isSuccess: false, message: "Không tải được trang tài liệu nào, kiểm tra lại link" };
    }

    const { questions, skippedCount } = await generateQuestionsFromDocs({
      docPages,
      courseTitle: course.title,
      topics: topics.filter(Boolean),
      types,
      count,
      hint,
      existingPrompts: await fetchExistingPrompts(courseId),
    });

    if (!questions.length) {
      return { isSuccess: false, message: "AI chưa ra được câu nào đạt yêu cầu, thử lại hoặc đổi trang tài liệu" };
    }

    await InterviewQuestionModel.insertMany(
      questions.map((question) => ({
        ...question,
        course: courseId,
        status: InterviewQuestionStatus.Draft,
        origin: InterviewQuestionOrigin.Ai,
        sourcePages: docPages.map((docPage) => docPage.url),
        createdBy: currentAdmin._id,
      })),
    );

    return { isSuccess: true, createdCount: questions.length, skippedCount };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false, message: "AI chưa trả lời được, thử lại sau nhé" };
  }
}

/** AI viết lại một câu theo cách khác, cùng dạng bài, cùng trang tài liệu. Câu về lại nháp */
export async function regenerateInterviewQuestion(
  questionId: string,
): Promise<RegenerateInterviewQuestionResult> {
  try {
    if (typeof questionId !== "string" || !isValidObjectId(questionId)) {
      return { isSuccess: false, message: "Câu hỏi không hợp lệ" };
    }

    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return { isSuccess: false, message: "Bạn không có quyền" };

    const aiAccessError = getAiAccessError();

    if (aiAccessError) return { isSuccess: false, message: aiAccessError };

    await connectToDatabase();

    const question: InterviewQuestionModelProps | null =
      await InterviewQuestionModel.findById(questionId);

    if (!question) return { isSuccess: false, message: "Câu hỏi không còn nữa" };

    const course = await CourseModel.findById(question.course)
      .select("title")
      .lean<{ title: string }>();
    const pageUrls = question.sourcePages.length
      ? question.sourcePages
      : question.sources.map((source) => source.url);
    const docPages = await fetchDocPages(pageUrls.slice(0, INTERVIEW_AI_PAGE_LIMIT));

    if (!docPages.length) {
      return { isSuccess: false, message: "Không tải được trang tài liệu của câu này" };
    }

    const courseId = question.course.toString();
    const { questions } = await generateQuestionsFromDocs({
      docPages,
      courseTitle: course?.title || "",
      topics: question.tags,
      types: [question.type],
      count: 1,
      hint: `Viết một câu khác thay cho câu này, cùng chủ đề nhưng khác code và cách hỏi: ${question.prompt}`,
      existingPrompts: await fetchExistingPrompts(courseId),
    });
    const [newContent] = questions;

    if (!newContent) {
      return { isSuccess: false, message: "AI chưa ra được câu đạt yêu cầu, thử lại nhé" };
    }

    const updatedQuestion = await InterviewQuestionModel.findByIdAndUpdate(
      questionId,
      {
        ...newContent,
        status: InterviewQuestionStatus.Draft,
        origin: InterviewQuestionOrigin.Ai,
        sourcePages: docPages.map((docPage) => docPage.url),
      },
      { new: true },
    );

    if (!updatedQuestion) return { isSuccess: false, message: "Câu hỏi không còn nữa" };

    return { isSuccess: true, question: toAdminQuestion(updatedQuestion) };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false, message: "AI chưa trả lời được, thử lại sau nhé" };
  }
}
