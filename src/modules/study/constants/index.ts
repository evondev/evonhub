import {
  PreviewStudyChapterSeed,
  PreviewStudyCourseSeed,
  StudyCourseStatus,
  StudyPreviewStateLink,
  StudyStatusMeta,
} from "../types";

// Lấy đủ khóa của học viên để danh sách không bị cắt
export const STUDY_COURSE_FETCH_LIMIT = 50;

// Đang học lên đầu, rồi chưa bắt đầu, đã xong xuống cuối
export const STUDY_STATUS_ORDER: Record<StudyCourseStatus, number> = {
  "in-progress": 0,
  "not-started": 1,
  completed: 2,
};

export const STUDY_STATUS_META: Record<StudyCourseStatus, StudyStatusMeta> = {
  "in-progress": { label: "Đang học", actionLabel: "Học tiếp" },
  "not-started": { label: "Chưa bắt đầu", actionLabel: "Bắt đầu học" },
  completed: { label: "Đã xong", actionLabel: "Học lại" },
};

export const STUDY_SKELETON_ROW_COUNT = 5;

// Bề rộng vệt chờ của tên chương và tên bài: dài ngắn lệch nhau cho giống chữ
export const STUDY_SKELETON_CHAPTER_WIDTHS: string[] = [
  "w-2/5",
  "w-1/3",
  "w-1/2",
  "w-1/4",
];

export const STUDY_SKELETON_LESSON_WIDTHS: string[] = [
  "w-1/3",
  "w-2/5",
  "w-1/4",
  "w-1/2",
];

// ----- Chỉ dùng cho trang xem trước ở dev (/study-preview) -----
// 7 khóa thật trong khu vực học tập; tiến độ và đề cương là GIẢ
export const PREVIEW_STUDY_COURSES: PreviewStudyCourseSeed[] = [
  {
    slug: "khoa-hoc-nextjs-pro",
    title: "Khóa học NextJS Pro - Xây dựng E Learning System hoàn chỉnh",
    image: "https://utfs.io/f/97868c0d-8a10-431e-a2d4-ca1be2436392-hcfblw.png",
    current: 8,
    total: 13,
  },
  {
    slug: "khoa-hoc-reactjs-master",
    title: "Khóa học ReactJS Master - Nắm vững kiến thức React chuyên sâu",
    image: "https://utfs.io/f/50be40a2-35e9-4420-9f8a-3a769f0a8a17-d8ajqo.jpg",
    current: 5,
    total: 40,
  },
  {
    slug: "khoa-hoc-vscode-pro",
    title: "Khóa học Vscode Pro - Thành thạo Vscode cho người mới",
    image: "",
    current: 0,
    total: 20,
  },
  {
    slug: "khoa-hoc-typescript-co-ban",
    title: "Khóa học Typescript cơ bản dành cho người mới",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80&auto=format&fit=crop",
    current: 0,
    total: 24,
  },
  {
    slug: "minh-hoa-vector-illustrator",
    title: "Minh hoạ vector bằng Adobe Illustrator cùng Rachelizmarvel",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&auto=format&fit=crop",
    current: 0,
    total: 30,
  },
  {
    slug: "khoa-hoc-reactjs-co-ban",
    title: "Khóa học ReactJS từ cơ bản đến nâng cao dành cho người mới",
    image: "https://utfs.io/f/4ad01579-440e-4098-8712-b60ffced479f-kzr59j.jpg",
    current: 0,
    total: 48,
  },
  {
    slug: "khoa-hoc-javascript-co-ban-cho-nguoi-moi",
    title: "Khóa học Javascript từ cơ bản đến nâng cao cho người mới bắt đầu",
    image: "https://utfs.io/f/c441d98a-8b32-49a2-8f4d-a37be5eedb15-o4mqd1.jpg",
    current: 50,
    total: 50,
  },
];

// Đề cương giả, gắn cho khóa nào cũng vậy; số bài đã học lấy từ tiến độ khóa
export const PREVIEW_STUDY_CHAPTERS: PreviewStudyChapterSeed[] = [
  {
    title: "Chương 1 · Khởi tạo dự án",
    lessons: [
      "Giới thiệu khóa học",
      "Cài đặt Next.js 14",
      "Cấu trúc thư mục",
      "Kết nối MongoDB",
    ],
  },
  {
    title: "Chương 2 · Xác thực người dùng",
    lessons: [
      "Cài Clerk",
      "Middleware bảo vệ route",
      "Đồng bộ user qua webhook",
    ],
  },
  {
    title: "Chương 3 · Quản lý khóa học",
    lessons: [
      "Tạo khóa học",
      "Upload ảnh bìa",
      "Danh sách khóa học",
      "Sửa và xoá khóa học",
    ],
  },
  {
    title: "Chương 4 · Bài học và video",
    lessons: ["Model bài học", "Phát video Mux"],
  },
];

export const PREVIEW_STUDY_STATE_LINKS: StudyPreviewStateLink[] = [
  { state: "du-lieu", label: "Có 7 khóa" },
  { state: "mot-khoa", label: "Chỉ 1 khóa" },
  { state: "rong", label: "Chưa có khóa" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];
