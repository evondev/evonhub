import { describe, expect, it } from "vitest";
import { InterviewDifficulty, InterviewQuestionType } from "../constants/interview-enums";
import { interviewQuestionContentSchema } from "../schemas";
import {
  getAttemptPoints,
  isCorrectChoice,
  isCorrectLogOrder,
} from "./interview-grading.utils";
import {
  buildQuestionProgressMap,
  findStartQuestionIndex,
} from "./interview-progress.utils";
import { shuffleBySeed } from "./interview-shuffle.utils";
import { formatQuestionStats, isLowCorrectRate } from "./interview-stats.utils";
import { isAllowedSourceUrl, isQuoteInText } from "./interview-source.utils";

describe("isCorrectChoice", () => {
  const options = [
    { id: "a", isCorrect: false },
    { id: "b", isCorrect: true },
  ];

  it("đúng khi chọn đáp án đúng", () => {
    expect(isCorrectChoice(options, "b")).toBe(true);
  });

  it("sai khi chọn đáp án sai hoặc id lạ", () => {
    expect(isCorrectChoice(options, "a")).toBe(false);
    expect(isCorrectChoice(options, "z")).toBe(false);
  });
});

describe("isCorrectLogOrder", () => {
  const logItems = ["render 1", "effect 1", "render 2", "cleanup 1", "effect 2"];

  it("đúng khi chọn đúng thứ tự", () => {
    expect(isCorrectLogOrder(logItems, [0, 1, 2, 3, 4])).toBe(true);
  });

  it("sai khi đổi chỗ, thiếu dòng hay chọn lặp", () => {
    expect(isCorrectLogOrder(logItems, [0, 2, 1, 3, 4])).toBe(false);
    expect(isCorrectLogOrder(logItems, [0, 1, 2, 3])).toBe(false);
    expect(isCorrectLogOrder(logItems, [0, 0, 2, 3, 4])).toBe(false);
    expect(isCorrectLogOrder(logItems, [0, 1, 2, 3, 9])).toBe(false);
  });

  it("hai dòng giống hệt nhau đổi chỗ vẫn đúng", () => {
    const strictModeLogs = ["effect", "cleanup", "effect"];

    expect(isCorrectLogOrder(strictModeLogs, [2, 1, 0])).toBe(true);
  });
});

describe("getAttemptPoints", () => {
  it("chỉ lượt đầu mà đúng mới có điểm, theo độ khó", () => {
    expect(getAttemptPoints({ difficulty: InterviewDifficulty.Hard, isCorrect: true, isFirstAttempt: true })).toBe(3);
    expect(getAttemptPoints({ difficulty: InterviewDifficulty.Hard, isCorrect: true, isFirstAttempt: false })).toBe(0);
    expect(getAttemptPoints({ difficulty: InterviewDifficulty.Easy, isCorrect: false, isFirstAttempt: true })).toBe(0);
  });
});

describe("shuffleBySeed", () => {
  const items = ["a", "b", "c", "d"];

  it("cùng hạt giống thì cùng thứ tự, đủ phần tử", () => {
    const firstShuffle = shuffleBySeed(items, "user-1:question-1");

    expect(shuffleBySeed(items, "user-1:question-1")).toEqual(firstShuffle);
    expect([...firstShuffle].sort()).toEqual(items);
  });

  it("không đổi mảng gốc", () => {
    shuffleBySeed(items, "seed");

    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});

describe("buildQuestionProgressMap", () => {
  it("có lượt đúng là correct dù lượt khác sai", () => {
    const progressMap = buildQuestionProgressMap([
      { questionId: "q1", isCorrect: false },
      { questionId: "q1", isCorrect: true },
      { questionId: "q2", isCorrect: false },
    ]);

    expect(progressMap.get("q1")).toBe("correct");
    expect(progressMap.get("q2")).toBe("wrong");
    expect(progressMap.has("q3")).toBe(false);
  });

  it("mở câu chưa làm trước, rồi tới câu sai", () => {
    expect(findStartQuestionIndex(["correct", "todo", "wrong"])).toBe(1);
    expect(findStartQuestionIndex(["correct", "wrong"])).toBe(1);
    expect(findStartQuestionIndex(["correct", "correct"])).toBe(0);
  });
});

describe("isAllowedSourceUrl", () => {
  it("chỉ nhận https của domain chính chủ", () => {
    expect(isAllowedSourceUrl("https://react.dev/learn/state-a-components-memory")).toBe(true);
    expect(isAllowedSourceUrl("https://developer.mozilla.org/en-US/docs/Web/JavaScript")).toBe(true);
    expect(isAllowedSourceUrl("http://react.dev/learn")).toBe(false);
    expect(isAllowedSourceUrl("https://reactjs.org/docs")).toBe(false);
    expect(isAllowedSourceUrl("https://react.dev.evil.com/learn")).toBe(false);
    expect(isAllowedSourceUrl("không phải link")).toBe(false);
  });
});

describe("isQuoteInText", () => {
  const pageText = "React waits until all code in the event handlers has run before processing your state updates.";

  it("khớp dù lệch nháy cong, hoa thường, khoảng trắng", () => {
    expect(isQuoteInText("react  waits until all code in the event handlers has run", pageText)).toBe(true);
    expect(isQuoteInText("“React waits until all code in the event handlers has run”", pageText)).toBe(true);
  });

  it("không khớp khi câu bịa hoặc quá ngắn", () => {
    expect(isQuoteInText("Calling the set function three times increments once.", pageText)).toBe(false);
    expect(isQuoteInText("React", pageText)).toBe(false);
  });
});

describe("interviewQuestionContentSchema với dạng sắp xếp log", () => {
  const buildLogOrderQuestion = (logItems: string[]) => ({
    type: InterviewQuestionType.LogOrder,
    difficulty: InterviewDifficulty.Easy,
    version: "React 19",
    prompt: "Sau khi bấm nút, log in ra theo thứ tự nào?",
    code: "console.log(n)",
    options: [],
    logItems,
    explanation: "State là ảnh chụp của lần render.",
    keyPoints: ["State không đổi trong cùng một lần render"],
    sources: [{ url: "https://react.dev/learn/state-as-a-snapshot", title: "", quote: "" }],
    tags: [],
  });

  it("nhận khi các dòng log khác nhau", () => {
    const parsed = interviewQuestionContentSchema.safeParse(buildLogOrderQuestion(["a 0", "b 0", "c 0"]));

    expect(parsed.success).toBe(true);
  });

  it("từ chối khi có dòng log trùng, vì đổi chỗ vẫn đúng", () => {
    const parsed = interviewQuestionContentSchema.safeParse(buildLogOrderQuestion(["0", "0", "0"]));

    expect(parsed.success).toBe(false);
  });
});

describe("thống kê câu hỏi", () => {
  it("ghi số người làm và phần trăm đúng, chưa ai làm thì nói rõ", () => {
    expect(formatQuestionStats({ learnerCount: 12, correctCount: 4 })).toBe("12 người làm · 33% đúng");
    expect(formatQuestionStats({ learnerCount: 0, correctCount: 0 })).toBe("Chưa ai làm");
  });

  it("chỉ nhắc khi đủ người làm mà ít người đúng", () => {
    expect(isLowCorrectRate({ learnerCount: 24, correctCount: 3 })).toBe(true);
    expect(isLowCorrectRate({ learnerCount: 4, correctCount: 0 })).toBe(false);
    expect(isLowCorrectRate({ learnerCount: 10, correctCount: 2 })).toBe(false);
  });
});
