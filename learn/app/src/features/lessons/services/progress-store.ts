import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LabProgress, LessonProgress, StepProgressPatch } from "../types/progress";
import { journalDir } from "./lab-paths";

// Tiến độ lưu thành file trong learn/journal/: đọc được bằng mắt, có lịch sử qua git,
// và Claude Code đọc được để biết bro đang hiểu sai ở đâu.
const progressFile = path.join(journalDir, "progress.json");

const emptyLessonProgress: LessonProgress = { steps: {} };

export async function readLabProgress(): Promise<LabProgress> {
  try {
    const fileContent = await readFile(progressFile, "utf8");

    return JSON.parse(fileContent) as LabProgress;
  } catch {
    return { lessons: {} };
  }
}

export async function readLessonProgress(lessonSlug: string) {
  const labProgress = await readLabProgress();

  return labProgress.lessons[lessonSlug] ?? emptyLessonProgress;
}

// Đọc, sửa, ghi cùng một file: hai lần lưu chồng nhau thì lần sau đè mất lần trước.
// Xếp hàng các lần ghi để mỗi lần đọc được bản mới nhất.
let pendingWrite: Promise<unknown> = Promise.resolve();

export function saveStepProgress(lessonSlug: string, stepId: string, patch: StepProgressPatch) {
  const writePromise = pendingWrite.then(() => writeStepProgress(lessonSlug, stepId, patch));
  pendingWrite = writePromise.catch(() => undefined);

  return writePromise;
}

async function writeStepProgress(lessonSlug: string, stepId: string, patch: StepProgressPatch) {
  const labProgress = await readLabProgress();
  const lessonProgress = labProgress.lessons[lessonSlug] ?? { steps: {} };
  const previousStep = lessonProgress.steps[stepId];

  const nextStep = {
    ...previousStep,
    ...patch,
    // Đã xong một lần thì giữ là xong, kể cả khi chạy lại bị trượt.
    isDone: Boolean(previousStep?.isDone || patch.isDone),
    updatedAt: new Date().toISOString(),
  };

  labProgress.lessons[lessonSlug] = { steps: { ...lessonProgress.steps, [stepId]: nextStep } };
  await mkdir(journalDir, { recursive: true });
  await writeFile(progressFile, JSON.stringify(labProgress, null, 2) + "\n");

  return nextStep;
}

export async function saveExplanationNote(lessonSlug: string, lessonTitle: string, prompt: string, text: string) {
  const notePath = path.join(journalDir, `${lessonSlug}.md`);
  const noteContent = `# ${lessonTitle}\n\n> ${prompt}\n\n${text.trim()}\n\n_Cập nhật: ${new Date().toLocaleString("vi-VN")}_\n`;

  await mkdir(journalDir, { recursive: true });
  await writeFile(notePath, noteContent);
}
