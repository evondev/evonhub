export interface ContentLesson {
  _id: string;
  title: string;
  slug: string;
  content: string;
  video: string;
  assetId?: string;
  iframe?: string;
  duration: number;
  order: number;
  lectureId: string;
  trial?: boolean;
  type?: string;
}

export interface ContentLecture {
  _id: string;
  title: string;
  lessons: ContentLesson[];
}

export interface CourseContentData {
  _id: string;
  title: string;
  slug: string;
  lecture: ContentLecture[];
}

export interface LessonEditorValues {
  title: string;
  slug: string;
  duration: number;
  video: string;
  assetId: string;
  iframe: string;
  content: string;
  trial: boolean;
}

export interface LessonIssues {
  isMissingVideo: boolean;
  isMissingContent: boolean;
}

export interface CourseContentStats {
  chapterCount: number;
  lessonCount: number;
  totalMinutes: number;
  missingVideoCount: number;
}

export interface LessonLocation {
  lecture: ContentLecture;
  lesson: ContentLesson;
  lessonIndex: number;
}

export type CourseContentPreviewState = "du-lieu" | "rong";

interface DeleteLessonAction {
  kind: "delete-lesson";
  lessonId: string;
  lectureId: string;
  title: string;
}

interface DeleteLectureAction {
  kind: "delete-lecture";
  lectureId: string;
  title: string;
  lessonCount: number;
}

export interface DiscardChangesAction {
  kind: "discard-changes";
  nextLessonId: string;
  currentTitle: string;
}

/** Việc đang chờ người dùng xác nhận trong hộp thoại */
export type PendingContentAction =
  DeleteLessonAction | DeleteLectureAction | DiscardChangesAction;

export interface LessonDragOutcome {
  lectures: ContentLecture[];
  isSameLecture: boolean;
  /** Danh sách bài của chương đích sau khi thả */
  destinationLessons: ContentLesson[];
}
