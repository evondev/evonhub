# learn/

Học backend bằng cách chuyển Evonhub sang NestJS + MySQL. Kế hoạch đầy đủ: [roadmap.md](roadmap.md).

## Bắt đầu

```bash
git checkout learn/nest-api
npm install --prefix api
npm install --prefix learn/labs/nest-lifecycle
```

Thứ tự học hiện tại:

1. [Bài 1 · Event loop](lessons/01-event-loop.md)
2. [Bài 2 · Vòng đời request NestJS](lessons/02-nest-request-lifecycle.md)
3. [Mốc 1 · Khung API](milestones/m01-api-skeleton.md) (giữa mốc sẽ mở [Bài 3 · mini-Express](lessons/03-mini-express.md))

Mở file bằng Markdown Preview (`Cmd+Shift+V`) để các khối đáp án gập lại.

## Lệnh hay dùng

| Việc | Lệnh |
| --- | --- |
| Chạy và chấm một bài lab | `node learn/labs/run.mjs <taskId>` (taskId ghi trong bài) |
| Chạy test chấp nhận của mốc | `cd api && npm test` |
| Chạy API | `cd api && npm start` → http://127.0.0.1:4000/api |
| Bật MySQL (từ mốc 2) | `cd api && docker compose up -d` |

## Thư mục

```
learn/
  roadmap.md        kế hoạch, mốc, trạng thái
  lessons/          bài lab: dự đoán, mô hình từng bước, tìm lỗi, chạy code, giải thích lại
  milestones/       đề bài từng mốc: tính năng Evonhub nào chuyển sang API
  labs/
    run.mjs         chạy và chấm bài lab
    exercises/      file bro sửa cho từng bài lab
    node-basics/    harness bài Node
    nest-lifecycle/ harness bài NestJS
  journal/          bro tự viết: phần giải thích lại, chỗ còn mơ hồ
api/                backend NestJS (lớn dần qua từng mốc)
```

Học trong lúc làm, có thắc mắc thì hỏi Claude ngay trong terminal ở gốc repo. Claude đọc được `learn/journal/` nên biết
bro đang hiểu sai ở đâu.
