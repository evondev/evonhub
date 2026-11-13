"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { saveInterviewKeyPoints } from "../actions";
import { useMutationSubmitInterviewAnswer } from "../services";
import {
  InterviewAnswerFeedback,
  InterviewQuestionProgress,
  InterviewSessionData,
  SubmitInterviewAnswerHandler,
} from "../types";
import { findStartQuestionIndex, isChoiceQuestionType } from "../utils";

interface QuestionAnswerState {
  selectedOptionId: string;
  logOrder: number[];
  explanationText: string;
}

const emptyAnswer: QuestionAnswerState = {
  selectedOptionId: "",
  logOrder: [],
  explanationText: "",
};

/**
 * Trạng thái một lượt làm bài: câu đang xem, câu trả lời, kết quả sau khi nộp.
 * submitHandler chỉ truyền ở trang xem trước, để chấm tại chỗ không gọi server
 */
export function useInterviewQuiz(session: InterviewSessionData, submitHandler?: SubmitInterviewAnswerHandler) {
  const [progresses, setProgresses] = useState<InterviewQuestionProgress[]>(() =>
    session.questions.map((question) => question.progress),
  );
  const [currentIndex, setCurrentIndex] = useState(() => findStartQuestionIndex(progresses));
  const [answer, setAnswer] = useState<QuestionAnswerState>(emptyAnswer);
  const [feedback, setFeedback] = useState<InterviewAnswerFeedback | null>(null);
  const [coveredKeyPoints, setCoveredKeyPoints] = useState<number[]>([]);
  const [points, setPoints] = useState(session.points);
  const submitMutation = useMutationSubmitInterviewAnswer(submitHandler);

  const currentQuestion = session.questions[currentIndex];
  const isChoice = isChoiceQuestionType(currentQuestion.type);
  const canSubmit = isChoice
    ? Boolean(answer.selectedOptionId)
    : answer.logOrder.length === currentQuestion.logItems.length;
  const isLastQuestion = currentIndex === session.questions.length - 1;
  const answeredCount = progresses.filter((progress) => progress !== "todo").length;
  const wrongCount = progresses.filter((progress) => progress === "wrong").length;

  function resetQuestionState() {
    setAnswer(emptyAnswer);
    setFeedback(null);
    setCoveredKeyPoints([]);
  }

  function goToQuestion(questionIndex: number) {
    setCurrentIndex(questionIndex);
    resetQuestionState();
    window.scrollTo({ top: 0 });
  }

  function goToNextQuestion() {
    if (!isLastQuestion) goToQuestion(currentIndex + 1);
  }

  function selectOption(optionId: string) {
    setAnswer((currentAnswer) => ({ ...currentAnswer, selectedOptionId: optionId }));
  }

  function pickLogItem(itemIndex: number) {
    setAnswer((currentAnswer) => ({
      ...currentAnswer,
      logOrder: [...currentAnswer.logOrder, itemIndex],
    }));
  }

  function removeLogItem(itemIndex: number) {
    setAnswer((currentAnswer) => ({
      ...currentAnswer,
      logOrder: currentAnswer.logOrder.filter((pickedIndex) => pickedIndex !== itemIndex),
    }));
  }

  function clearLogOrder() {
    setAnswer((currentAnswer) => ({ ...currentAnswer, logOrder: [] }));
  }

  function changeExplanation(explanationText: string) {
    setAnswer((currentAnswer) => ({ ...currentAnswer, explanationText }));
  }

  async function submitAnswer() {
    if (!canSubmit || submitMutation.isPending) return;

    const result = await submitMutation.mutateAsync({
      questionId: currentQuestion.id,
      selectedOptionId: isChoice ? answer.selectedOptionId : undefined,
      logOrder: isChoice ? undefined : answer.logOrder,
      explanationText: answer.explanationText,
    });

    if (!result.isSuccess || !result.feedback) {
      toast.error(result.message || "Chưa nộp được, thử lại sau nhé");
      return;
    }

    const answerFeedback = result.feedback;

    setFeedback(answerFeedback);
    setPoints((currentPoints) => currentPoints + answerFeedback.pointsAwarded);
    setProgresses((currentProgresses) =>
      currentProgresses.map((progress, index) => {
        if (index !== currentIndex || progress === "correct") return progress;

        return answerFeedback.isCorrect ? "correct" : "wrong";
      }),
    );
  }

  function toggleKeyPoint(keyPointIndex: number) {
    if (!feedback) return;

    const nextCoveredKeyPoints = coveredKeyPoints.includes(keyPointIndex)
      ? coveredKeyPoints.filter((coveredIndex) => coveredIndex !== keyPointIndex)
      : [...coveredKeyPoints, keyPointIndex];

    setCoveredKeyPoints(nextCoveredKeyPoints);

    if (submitHandler) return;

    // Chỉ để học viên tự xem lại, lưu không được thì thôi, không làm phiền
    saveInterviewKeyPoints({
      attemptId: feedback.attemptId,
      coveredKeyPoints: nextCoveredKeyPoints,
    });
  }

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: session.questions.length,
    answer,
    feedback,
    coveredKeyPoints,
    points,
    answeredCount,
    wrongCount,
    canSubmit,
    isSubmitting: submitMutation.isPending,
    isLastQuestion,
    selectOption,
    pickLogItem,
    removeLogItem,
    clearLogOrder,
    changeExplanation,
    submitAnswer,
    toggleKeyPoint,
    goToNextQuestion,
    retryQuestion: resetQuestionState,
  };
}
