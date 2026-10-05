import type {
  ContentLecture,
  ContentLesson,
  CourseContentData,
  CourseContentPreviewState,
} from "./types";

export const LESSON_EDITOR_HEIGHT = 420;

export const NEW_LESSON_TITLE = "Tiêu đề bài học mới";

export const NEW_LECTURE_TITLE = "Tiêu đề chương mới";

interface PreviewLessonSeed {
  title: string;
  duration: number;
  hasVideo?: boolean;
  hasIframe?: boolean;
  hasContent?: boolean;
  trial?: boolean;
}

interface PreviewLectureSeed {
  title: string;
  lessons: PreviewLessonSeed[];
}

const PREVIEW_FIRST_LESSON_CONTENT = `<p>Nhóm khóa học: <a href="https://t.me/+NyrZPYu53ww1NTc1">https://t.me/+NyrZPYu53ww1NTc1</a></p>
<p>Source code: <a href="https://github.com/evondev/react-in-depth">https://github.com/evondev/react-in-depth</a></p>
<p>Cài đặt cần có:</p>
<ul><li>NodeJS</li><li>GitBash hoặc ZSH</li><li>NPM</li><li>VS Code</li></ul>`;

const previewLectureSeeds: PreviewLectureSeed[] = [
  {
    title: "Chương 01: Giới thiệu",
    lessons: [
      {
        title: "Bài 01: Giới thiệu",
        duration: 2,
        hasVideo: true,
        hasContent: true,
        trial: true,
      },
      {
        title: "Bài 02: Cài đặt môi trường với Vite",
        duration: 6,
        hasVideo: true,
        hasContent: true,
        trial: true,
      },
      { title: "Bài 03: Cấu trúc thư mục dự án", duration: 4, hasVideo: true },
    ],
  },
  {
    title: "Chương 02: React key attribute",
    lessons: [
      {
        title: "Bài 04: Vì sao React cần key",
        duration: 9,
        hasVideo: true,
        hasContent: true,
      },
      {
        title:
          "Bài 05: Dùng index làm key và những lỗi khó thấy khi danh sách đổi thứ tự",
        duration: 14,
        hasVideo: true,
        hasContent: true,
      },
      { title: "Bài 06: Reset state bằng key", duration: 0 },
    ],
  },
  {
    title: "Chương 03: React reconciliation",
    lessons: [
      {
        title: "Bài 07: Virtual DOM và quá trình so sánh",
        duration: 12,
        hasVideo: true,
        hasContent: true,
      },
      {
        title: "Bài 08: Vì sao không khai báo component trong component",
        duration: 8,
        hasIframe: true,
        hasContent: true,
      },
      { title: "Bài 09: Bài tập", duration: 5, hasVideo: true },
    ],
  },
  {
    title: "Chương 04: Re-renders cơ bản trong React",
    lessons: [
      {
        title: "Bài 10: Khi nào component re-render",
        duration: 11,
        hasVideo: true,
        hasContent: true,
      },
      {
        title: "Bài 11: Di chuyển state xuống dưới",
        duration: 7,
        hasVideo: true,
        hasContent: true,
      },
      { title: "Bài 12: Truyền component qua children", duration: 0 },
    ],
  },
  {
    title: "Chương 05: React patterns",
    lessons: [
      {
        title: "Bài 13: Compound components",
        duration: 16,
        hasVideo: true,
        hasContent: true,
      },
      {
        title: "Bài 14: Render props",
        duration: 10,
        hasVideo: true,
        hasContent: true,
      },
    ],
  },
  { title: "Chương 06: Ôn tập và bài tập cuối khóa", lessons: [] },
];

function getPreviewContent(seed: PreviewLessonSeed, isFirstLesson: boolean) {
  if (!seed.hasContent) return "";
  if (isFirstLesson) return PREVIEW_FIRST_LESSON_CONTENT;

  return `<p>Ghi chú và đoạn code mẫu cho ${seed.title.toLowerCase()}.</p>`;
}

function buildPreviewLesson(
  seed: PreviewLessonSeed,
  lectureId: string,
  order: number,
  lessonNumber: number,
): ContentLesson {
  const isFirstLesson = lessonNumber === 1;

  return {
    _id: `preview-lesson-${lessonNumber}`,
    title: seed.title,
    slug: `bai-${String(lessonNumber).padStart(2, "0")}`,
    content: getPreviewContent(seed, isFirstLesson),
    video: seed.hasVideo ? "wDuFpNJ39Gq7Cj5ze61glrWBVBC902w9HWAFr00Z5EqMk" : "",
    // Bài đầu thiếu Asset ID như dữ liệu thật trong ảnh hiện trạng
    assetId: seed.hasVideo && !isFirstLesson ? "Qp7aR02xY1t5uVb8mZ3cN6" : "",
    iframe: seed.hasIframe
      ? '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>'
      : "",
    duration: seed.duration,
    order,
    lectureId,
    trial: !!seed.trial,
    type: "video",
  };
}

function buildPreviewLectures(): ContentLecture[] {
  let lessonNumber = 0;

  return previewLectureSeeds.map((lectureSeed, lectureIndex) => {
    const lectureId = `preview-lecture-${lectureIndex + 1}`;

    return {
      _id: lectureId,
      title: lectureSeed.title,
      lessons: lectureSeed.lessons.map((lessonSeed, lessonIndex) => {
        lessonNumber += 1;

        return buildPreviewLesson(
          lessonSeed,
          lectureId,
          lessonIndex + 1,
          lessonNumber,
        );
      }),
    };
  });
}

export const PREVIEW_COURSE_CONTENT_DATA: Record<
  CourseContentPreviewState,
  CourseContentData
> = {
  "du-lieu": {
    _id: "preview-course",
    title: "Khóa học ReactJS chuyên sâu",
    slug: "khoa-hoc-reactjs-chuyen-sau",
    lecture: buildPreviewLectures(),
  },
  rong: {
    _id: "preview-course-empty",
    title: "Khóa học NextJS từ cơ bản tới nâng cao",
    slug: "khoa-hoc-nextjs",
    lecture: [],
  },
};

// Ô nhập trong form: 44px màn hẹp, 40px từ md, viền đỏ khi lỗi (cùng giá trị với trang sửa khóa học)
export const LESSON_FORM_CONTROL_CLASS_NAME =
  "h-11 md:h-10 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/10";
