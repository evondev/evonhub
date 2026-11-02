# learn/ và api/ (nhánh learn/nest-api)

Chủ repo học backend bằng cách chuyển dần Evonhub sang NestJS + MySQL. Chỉ chạy local, không bao giờ deploy nhánh này.

**Đầu mỗi phiên:** đọc `learn/roadmap.md` (mốc hiện tại, việc tiếp theo) và `learn/journal/` (chủ repo hiểu sai ở
đâu). Xong một mốc thì cập nhật mục Trạng thái.

## Người học

- Giỏi React/Next.js, tác giả Evonhub. Không cần dạy lại JS/TS; so sánh với frontend khi giúp hiểu nhanh hơn.
- Muốn hiểu **vì sao**, không chỉ làm dự án. Yếu nhất: authentication / JWT, nên chặng auth phải kỹ nhất.
- Không muốn tự setup hay gõ code từng dòng: Claude lo khung, cài đặt, test, harness. Chủ repo dự đoán, viết các chỗ
  `TODO (mốc X)`, chạy, phá thử, giải thích lại.
- Tiếng Việt, xưng "bro". Không tự commit/push khi chưa được bảo.

## Viết mốc mới

- Mốc là một `Milestone` trong `learn/app/src/features/lessons/constants/milestones/`, thêm vào `milestoneCatalog`
  và bỏ dòng tương ứng ở `upcoming-milestones.ts`. Mỗi mốc nói rõ **sau mốc này phần nào của Evonhub chạy qua API**
  và cách bật bằng `API_MODULES`. Bộ test khai ở `constants/acceptance-suite-configs.ts` (workspace `evonhub-api` = `api/`).
  Mốc có `gameLevels` (màn GonnaCrash) và `loadTest` thì giữ hai trường đó khi chuyển; mốc từ 6 trở đi có bước "phá
  bằng tải" bằng `autocannon`, số đo trong bài phải là số chạy thật.
- Test chấp nhận ở `api/test/milestone-XX.e2e.ts` (`node:test` + `fetch` tới app thật dựng bằng `createApp()`).
  Thử cả code gốc có TODO (phải trượt một phần) lẫn bản giải (phải xanh hết) trước khi giao.
- Chỗ chủ repo viết đánh dấu `// TODO (mốc X): ...` ngay trong file thật của `api/`.
- Dữ liệu thật đi qua script `api/scripts/import-*.ts` đọc MongoDB local; không sửa dữ liệu Mongo.
- Đổi server action phía Next: giữ nguyên nhánh Mongoose, thêm nhánh gọi API khi module có trong `API_MODULES`.

## Viết bài lab mới

Nội dung là TypeScript có kiểu, nguồn duy nhất (không có bản markdown song song):

- Bài là một `Lesson` trong `learn/app/src/features/lessons/constants/lessons/`, thêm vào `lessonCatalog`. Bài mở ra
  giữa một mốc thì mốc có bước `lab-link` trỏ tới nó. Các loại bước: `prose`, `predict`, `step-flow`, `spot-bug`,
  `code-task`, `explain-back` (xem `types/lesson.ts`).
- Câu dự đoán: **mỗi đáp án sai có giải thích riêng** (vì sao sai, ai hay nghĩ vậy).
- `step-flow`: tối đa một cái mỗi bài, cho thứ không nhìn thấy và diễn ra theo thời gian; câu hỏi đặt ở bước trước
  khi lộ kết quả.
- `code-task`: harness ở `learn/labs/<workspace>/tasks/<task>/` (hoặc template của `nest-lifecycle`), khai trong
  `constants/task-run-configs.ts`. Harness in một dòng `__RESULT__{"checks":[...]}`. Thử bản sai (phải trượt) và bản
  đúng (phải đạt) qua web trước khi giao.
- Mọi con số, thứ tự in ra trong bài phải khớp lần chạy thật trên máy này: chạy harness trước, viết caption sau.

## Web học (learn/app)

Next 16 (cacheComponents), chỉ nghe 127.0.0.1:3939, `src/proxy.ts` chặn Host lạ. Đường dẫn tới `api/`, `learn/labs`,
`learn/journal` gom ở `services/lab-paths.ts`. Bố cục B: `StepPageShell` → `WorkbenchProvider` giữ code và kết quả
chạy dùng chung giữa bước bên trái và bàn làm việc bên phải. Token màu, font lấy từ Evonhub (`src/app/globals.css`).
Đổi UI thì theo skill `evon:ui-ux` và quy ước trong `~/.claude/CLAUDE.md`.

## api/

NestJS 12 (ESM, import nội bộ có đuôi `.js`), TypeScript 7, cổng 4000. MySQL qua `api/docker-compose.yml` ở cổng
3307. Quy ước đặt tên theo `~/.claude/CLAUDE.md` (tên rõ nghĩa, `interface`, khoảng trắng giữa các khối).
