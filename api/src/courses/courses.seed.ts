import type { CourseRecord } from "./course.types.js";

// Dữ liệu chép từ MongoDB của Evonhub. Mongo không ép schema nên bản ghi cũ có thể thiếu field:
// khoá html-css-2019 tạo trước khi có field rating. Kiểu CourseRecord chỉ là lời hứa lúc biên dịch,
// lúc chạy không ai kiểm tra. Mốc 2 chuyển sang MySQL, cột NOT NULL sẽ chặn chuyện này.
const importedFromMongo = [
  {
    slug: "nextjs-14-fullstack",
    title: "Next.js 14 Fullstack: Xây dựng Evonhub",
    price: 1_999_000,
    salePrice: 999_000,
    level: "medium",
    status: "approved",
    rating: [5, 5, 4, 5],
    _destroy: false,
  },
  {
    slug: "javascript-co-ban",
    title: "JavaScript cơ bản cho người mới",
    price: 499_000,
    salePrice: 0,
    level: "easy",
    status: "approved",
    rating: [5, 4],
    _destroy: false,
  },
  {
    slug: "nestjs-mysql",
    title: "NestJS + MySQL từ đầu",
    price: 1_499_000,
    salePrice: 1_199_000,
    level: "expert",
    status: "pending",
    rating: [],
    _destroy: false,
  },
  {
    slug: "html-css-2019",
    title: "HTML CSS 2019 (bản cũ, vẫn mở cho người đã mua)",
    price: 299_000,
    salePrice: 0,
    level: "easy",
    status: "archived",
    _destroy: false,
  },
  {
    slug: "react-co-ban-da-xoa",
    title: "React cơ bản (đã xoá)",
    price: 599_000,
    salePrice: 0,
    level: "easy",
    status: "approved",
    rating: [3],
    _destroy: true,
  },
];

export const courseRecords = importedFromMongo as CourseRecord[];
