"use server";

import { recordActivity } from "@/modules/activity/services/activity.service";
import CourseModel from "@/modules/course/models";
import { ActivityType } from "@/shared/constants/activity.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { connectToDatabase } from "@/shared/libs";
import { canAccessCourseContent, getCurrentUser } from "@/shared/libs/auth";
import { isValidObjectId, Types } from "mongoose";
import { InterviewQuestionStatus } from "../constants/interview-enums";
import { InterviewAttemptModel, InterviewQuestionModel } from "../models";
import {
  saveInterviewKeyPointsSchema,
  submitInterviewAnswerSchema,
} from "../schemas";
import { toPracticeQuestion } from "../services/interview-mapper.service";
import {
  InterviewCourseSummary,
  InterviewQuestionModelProps,
  InterviewSessionData,
  SaveInterviewKeyPointsInput,
  SaveInterviewKeyPointsResult,
  SubmitInterviewAnswerInput,
  SubmitInterviewAnswerResult,
} from "../types";
import {
  buildQuestionProgressMap,
  getAttemptPoints,
  isChoiceQuestionType,
  isCorrectChoice,
  isCorrectLogOrder,
} from "../utils";

interface PublishedQuestionRef {
  _id: Types.ObjectId;
  course: Types.ObjectId;
}

interface AttemptOutcomeRow {
  question: Types.ObjectId;
  course: Types.ObjectId;
  isCorrect: boolean;
  points: number;
  createdAt: Date;
}

interface CourseInfoRow {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  image?: string;
}

const DUPLICATE_KEY_ERROR_CODE = 11000;

function isDuplicateKeyError(error: unknown) {
  return (error as { code?: number })?.code === DUPLICATE_KEY_ERROR_CODE;
}

/** Khoá đã mua (Admin: mọi khoá) có ít nhất một câu đã đăng, kèm tiến độ của người học */
export async function fetchMyInterviewCourses(): Promise<
  InterviewCourseSummary[] | undefined
> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return [];

    await connectToDatabase();

    const isAdmin = currentUser.role === UserRole.Admin;
    const questionQuery = isAdmin
      ? { status: InterviewQuestionStatus.Published }
      : {
          status: InterviewQuestionStatus.Published,
          course: { $in: currentUser.courses || [] },
        };
    const publishedQuestions = await InterviewQuestionModel.find(questionQuery)
      .select("_id course")
      .lean<PublishedQuestionRef[]>();

    if (!publishedQuestions.length) return [];

    const courseIds = [
      ...new Set(publishedQuestions.map((question) => question.course.toString())),
    ];
    const [courses, attempts] = await Promise.all([
      CourseModel.find({ _id: { $in: courseIds }, _destroy: false })
        .select("title slug image")
        .lean<CourseInfoRow[]>(),
      InterviewAttemptModel.find({
        user: currentUser._id,
        question: { $in: publishedQuestions.map((question) => question._id) },
      })
        .select("question course isCorrect points createdAt")
        .lean<AttemptOutcomeRow[]>(),
    ]);

    const summaries = courses.map((course): InterviewCourseSummary => {
      const courseId = course._id.toString();
      const courseAttempts = attempts.filter(
        (attempt) => attempt.course.toString() === courseId,
      );
      const progressMap = buildQuestionProgressMap(
        courseAttempts.map((attempt) => ({
          questionId: attempt.question.toString(),
          isCorrect: attempt.isCorrect,
        })),
      );
      const progresses = [...progressMap.values()];
      const lastAttempt = courseAttempts.reduce<AttemptOutcomeRow | undefined>(
        (latest, attempt) =>
          !latest || attempt.createdAt > latest.createdAt ? attempt : latest,
        undefined,
      );

      return {
        id: courseId,
        title: course.title,
        slug: course.slug,
        image: course.image || "",
        totalQuestions: publishedQuestions.filter(
          (question) => question.course.toString() === courseId,
        ).length,
        answeredCount: progresses.length,
        wrongCount: progresses.filter((progress) => progress === "wrong").length,
        points: courseAttempts.reduce((total, attempt) => total + (attempt.points || 0), 0),
        lastPracticedAt: lastAttempt?.createdAt.toISOString(),
      };
    });

    // Khoá vừa luyện lên đầu, khoá chưa luyện xếp theo tên
    return summaries.sort((first, second) => {
      if (first.lastPracticedAt || second.lastPracticedAt) {
        return (second.lastPracticedAt || "").localeCompare(first.lastPracticedAt || "");
      }

      return first.title.localeCompare(second.title, "vi");
    });
  } catch (error) {
    console.log("error:", error);
  }
}

/**
 * Câu hỏi đã đăng của một khoá để làm bài, không kèm đáp án. null là không có
 * khoá này, chưa mua, hoặc khoá chưa có câu nào; undefined là lỗi
 */
export async function fetchInterviewSession(
  courseSlug: string,
): Promise<InterviewSessionData | null | undefined> {
  try {
    if (typeof courseSlug !== "string" || !courseSlug) return null;

    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    await connectToDatabase();

    const course = await CourseModel.findOne({ slug: courseSlug, _destroy: false })
      .select("title slug")
      .lean<CourseInfoRow>();

    if (!course) return null;

    const courseId = course._id.toString();

    if (!(await canAccessCourseContent(courseId))) return null;

    const questions = await InterviewQuestionModel.find({
      course: course._id,
      status: InterviewQuestionStatus.Published,
    }).sort({ publishedAt: 1, _id: 1 });

    if (!questions.length) return null;

    // Vào làm lại hay tải lại trang trong 30 phút thì vẫn là một dòng nhật ký
    await recordActivity({
      userId: currentUser._id,
      type: ActivityType.PracticeInterview,
      courseId: course._id,
      targetTitle: course.title,
      shouldMergeRecent: true,
    });

    const attempts = await InterviewAttemptModel.find({
      user: currentUser._id,
      question: { $in: questions.map((question) => question._id) },
    })
      .select("question isCorrect points")
      .lean<AttemptOutcomeRow[]>();
    const progressMap = buildQuestionProgressMap(
      attempts.map((attempt) => ({
        questionId: attempt.question.toString(),
        isCorrect: attempt.isCorrect,
      })),
    );
    const userId = currentUser._id.toString();

    return {
      course: { id: courseId, title: course.title, slug: course.slug },
      questions: questions.map((question: InterviewQuestionModelProps) =>
        toPracticeQuestion(
          question,
          userId,
          progressMap.get(String(question._id)) || "todo",
        ),
      ),
      points: attempts.reduce((total, attempt) => total + (attempt.points || 0), 0),
    };
  } catch (error) {
    console.log("error:", error);
  }
}

/** Nộp một câu: server chấm, chỉ lượt đầu mà đúng mới cộng điểm, trả đáp án và giải thích */
export async function submitInterviewAnswer(
  input: SubmitInterviewAnswerInput,
): Promise<SubmitInterviewAnswerResult> {
  try {
    const parsedInput = submitInterviewAnswerSchema.safeParse(input);

    if (!parsedInput.success || !isValidObjectId(parsedInput.data.questionId)) {
      return { isSuccess: false, message: "Câu trả lời không hợp lệ" };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) return { isSuccess: false, message: "Bạn cần đăng nhập" };

    await connectToDatabase();

    const question: InterviewQuestionModelProps | null =
      await InterviewQuestionModel.findOne({
        _id: parsedInput.data.questionId,
        status: InterviewQuestionStatus.Published,
      });

    if (!question) return { isSuccess: false, message: "Câu hỏi không còn nữa" };

    if (!(await canAccessCourseContent(question.course.toString()))) {
      return { isSuccess: false, message: "Bạn chưa mua khoá này" };
    }

    const { selectedOptionId, logOrder, explanationText } = parsedInput.data;
    const isChoice = isChoiceQuestionType(question.type);
    const options = question.options.map((option) => ({
      id: option._id.toString(),
      isCorrect: option.isCorrect,
    }));

    if (isChoice && !selectedOptionId) {
      return { isSuccess: false, message: "Chọn một đáp án trước khi nộp" };
    }

    if (!isChoice && logOrder?.length !== question.logItems.length) {
      return { isSuccess: false, message: "Xếp đủ các dòng log trước khi nộp" };
    }

    const isCorrect = isChoice
      ? isCorrectChoice(options, selectedOptionId || "")
      : isCorrectLogOrder(question.logItems, logOrder || []);
    const hasFirstAttempt = await InterviewAttemptModel.exists({
      user: currentUser._id,
      question: question._id,
      isFirstAttempt: true,
    });
    const attemptValues = {
      user: currentUser._id,
      question: question._id,
      course: question.course,
      selectedOptionId: isChoice ? selectedOptionId : undefined,
      logOrder: isChoice ? undefined : logOrder,
      isCorrect,
      explanationText: explanationText.trim(),
    };
    let isFirstAttempt = !hasFirstAttempt;
    let attempt;

    try {
      attempt = await InterviewAttemptModel.create({
        ...attemptValues,
        isFirstAttempt,
        points: getAttemptPoints({ difficulty: question.difficulty, isCorrect, isFirstAttempt }),
      });
    } catch (error) {
      // Hai lần nộp cùng lúc: lần kia đã giữ chỗ lượt đầu, lần này không tính điểm
      if (!isDuplicateKeyError(error)) throw error;

      isFirstAttempt = false;
      attempt = await InterviewAttemptModel.create({
        ...attemptValues,
        isFirstAttempt,
        points: 0,
      });
    }

    const correctOption = question.options.find((option) => option.isCorrect);

    return {
      isSuccess: true,
      feedback: {
        attemptId: attempt._id.toString(),
        isCorrect,
        isFirstAttempt,
        pointsAwarded: attempt.points,
        correctOptionId: isChoice ? correctOption?._id.toString() : undefined,
        correctLogItems: isChoice ? undefined : question.logItems,
        explanation: question.explanation,
        keyPoints: question.keyPoints,
        sources: question.sources.map((source) => ({
          url: source.url,
          title: source.title,
        })),
        version: question.version,
      },
    };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false, message: "Chưa nộp được, thử lại sau nhé" };
  }
}

/** Lưu các ý chính học viên tự tick sau khi nộp. Không tính điểm */
export async function saveInterviewKeyPoints(
  input: SaveInterviewKeyPointsInput,
): Promise<SaveInterviewKeyPointsResult> {
  try {
    const parsedInput = saveInterviewKeyPointsSchema.safeParse(input);

    if (!parsedInput.success || !isValidObjectId(parsedInput.data.attemptId)) {
      return { isSuccess: false };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) return { isSuccess: false };

    await connectToDatabase();

    const updatedAttempt = await InterviewAttemptModel.findOneAndUpdate(
      { _id: parsedInput.data.attemptId, user: currentUser._id },
      { coveredKeyPoints: [...new Set(parsedInput.data.coveredKeyPoints)] },
    );

    return { isSuccess: Boolean(updatedAttempt) };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false };
  }
}
