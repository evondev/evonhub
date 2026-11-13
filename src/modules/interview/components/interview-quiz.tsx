"use client";

import { useInterviewQuiz } from "../hooks/use-interview-quiz";
import { InterviewSessionData, SubmitInterviewAnswerHandler } from "../types";
import { isChoiceQuestionType } from "../utils";
import { InterviewCodeBlock } from "./interview-code-block";
import { InterviewFeedbackPanel } from "./interview-feedback-panel";
import { InterviewLogOrder } from "./interview-log-order";
import { InterviewOptionList } from "./interview-option-list";
import { InterviewQuestionHeader } from "./interview-question-header";
import { InterviewQuizActions } from "./interview-quiz-actions";
import { InterviewQuizTopBar } from "./interview-quiz-top-bar";
import { InterviewWhyInput } from "./interview-why-input";

interface InterviewQuizProps {
  session: InterviewSessionData;
  /** Chỉ trang xem trước truyền: chấm tại chỗ, không gọi server */
  submitHandler?: SubmitInterviewAnswerHandler;
}

/** Làm bài một câu một màn: chọn, viết "vì sao", nộp, đọc giải thích, sang câu tiếp */
export function InterviewQuiz({ session, submitHandler }: InterviewQuizProps) {
  const quiz = useInterviewQuiz(session, submitHandler);
  const { currentQuestion, feedback, answer } = quiz;
  const isSubmitted = Boolean(feedback);

  return (
    <div className="mx-auto max-w-3xl">
      <InterviewQuizTopBar
        courseTitle={session.course.title}
        currentNumber={quiz.currentIndex + 1}
        totalQuestions={quiz.totalQuestions}
        answeredCount={quiz.answeredCount}
        wrongCount={quiz.wrongCount}
        points={quiz.points}
      />
      <article className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <InterviewQuestionHeader question={currentQuestion} />
        {currentQuestion.code && (
          <InterviewCodeBlock code={currentQuestion.code} version={currentQuestion.version} />
        )}
        {isChoiceQuestionType(currentQuestion.type) ? (
          <InterviewOptionList
            options={currentQuestion.options}
            selectedOptionId={answer.selectedOptionId}
            correctOptionId={feedback?.correctOptionId}
            isSubmitted={isSubmitted}
            onSelect={quiz.selectOption}
          />
        ) : (
          <InterviewLogOrder
            logItems={currentQuestion.logItems}
            logOrder={answer.logOrder}
            isSubmitted={isSubmitted}
            correctLogItems={feedback?.correctLogItems}
            onPick={quiz.pickLogItem}
            onRemove={quiz.removeLogItem}
            onClear={quiz.clearLogOrder}
          />
        )}
        {feedback ? (
          <InterviewFeedbackPanel
            feedback={feedback}
            explanationText={answer.explanationText}
            coveredKeyPoints={quiz.coveredKeyPoints}
            onToggleKeyPoint={quiz.toggleKeyPoint}
          />
        ) : (
          <InterviewWhyInput
            questionId={currentQuestion.id}
            value={answer.explanationText}
            onChange={quiz.changeExplanation}
          />
        )}
        <InterviewQuizActions
          isSubmitted={isSubmitted}
          isCorrect={Boolean(feedback?.isCorrect)}
          canSubmit={quiz.canSubmit}
          isSubmitting={quiz.isSubmitting}
          isLastQuestion={quiz.isLastQuestion}
          onSkip={quiz.goToNextQuestion}
          onSubmit={quiz.submitAnswer}
          onRetry={quiz.retryQuestion}
          onNext={quiz.goToNextQuestion}
        />
      </article>
    </div>
  );
}
