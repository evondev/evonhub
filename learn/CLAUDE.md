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

- Đề bài ở `learn/milestones/mXX-<tên>.md`. Mỗi mốc nói rõ **sau mốc này phần nào của Evonhub chạy qua API** và cách
  bật bằng `API_MODULES`.
- Test chấp nhận ở `api/test/milestone-XX.e2e.ts` (`node:test` + `fetch` tới app thật dựng bằng `createApp()`).
  Thử cả code gốc có TODO (phải trượt một phần) lẫn bản giải (phải xanh hết) trước khi giao.
- Chỗ chủ repo viết đánh dấu `// TODO (mốc X): ...` ngay trong file thật của `api/`.
- Dữ liệu thật đi qua script `api/scripts/import-*.ts` đọc MongoDB local; không sửa dữ liệu Mongo.
- Đổi server action phía Next: giữ nguyên nhánh Mongoose, thêm nhánh gọi API khi module có trong `API_MODULES`.

## Viết bài lab mới

Bài ở `learn/lessons/NN-<tên>.md`, theo đúng khuôn của bài 1–3:

- `## 01 · <Loại>: <tiêu đề>`; các loại: Đọc, Dự đoán, Mô hình từng bước, Tìm lỗi, Chạy code, Giải thích lại.
- Câu dự đoán: liệt kê A/B/C/D, đáp án trong `<details>`; **mỗi đáp án sai có giải thích riêng**.
- Mô hình từng bước: mỗi bước một đoạn **Bước k/n** + trạng thái các cột; câu hỏi đặt trước bước lộ kết quả.
- Tìm lỗi: code có đánh số dòng, đáp án và ghi chú từng dòng trong `<details>`.
- Chạy code: harness ở `learn/labs/<workspace>/tasks/<task>/`, file bro sửa ở `learn/labs/exercises/<taskId>/`, khai
  báo trong `taskConfigs` của `learn/labs/run.mjs`. Harness in một dòng `__RESULT__{"checks":[...]}`.
- Mọi con số, thứ tự in ra trong bài phải khớp lần chạy thật trên máy này: chạy harness trước, viết caption sau.

## api/

NestJS 12 (ESM, import nội bộ có đuôi `.js`), TypeScript 7, cổng 4000. MySQL qua `api/docker-compose.yml` ở cổng
3307. Quy ước đặt tên theo `~/.claude/CLAUDE.md` (tên rõ nghĩa, `interface`, khoảng trắng giữa các khối).
