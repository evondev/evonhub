import { CourseItemData } from "@/modules/course/types";

export type StudyCourseStatus = "in-progress" | "not-started" | "completed";

export interface StudyLessonLink {
  _id: string;
  slug: string;
}

/** Một khóa học viên sở hữu, kèm tiến độ */
export interface StudyCourse {
  course: CourseItemData;
  /** Bài đầu tiên của khóa, dùng khi chưa có đề cương */
  firstLesson?: StudyLessonLink;
  progress: number;
  current: number;
  total: number;
  status: StudyCourseStatus;
}

export interface StudyLesson {
  id: string;
  title: string;
  isCompleted: boolean;
  isNext: boolean;
}

export interface StudyChapter {
  key: string;
  title: string;
  lessons: StudyLesson[];
  completedCount: number;
}

export interface StudyOutline {
  chapters: StudyChapter[];
  /** Bài đầu tiên chưa học theo thứ tự đề cương; học hết thì không có */
  nextLesson?: StudyLesson;
  firstLesson?: StudyLesson;
}

export interface StudyStatusMeta {
  label: string;
  actionLabel: string;
}

export interface PreviewStudyCourseSeed {
  slug: string;
  title: string;
  image: string;
  current: number;
  total: number;
}

export interface PreviewStudyChapterSeed {
  title: string;
  lessons: string[];
}

export type StudyPreviewState =
  "du-lieu" | "mot-khoa" | "rong" | "dang-tai" | "loi";

export interface StudyPreviewStateLink {
  state: StudyPreviewState;
  label: string;
}
