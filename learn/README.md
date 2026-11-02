# learn/

Học backend bằng cách chuyển Evonhub sang NestJS + MySQL. Kế hoạch đầy đủ: [roadmap.md](roadmap.md).

## Bắt đầu

```bash
git checkout learn/nest-api
npm install --prefix learn/app
npm install --prefix api
npm install --prefix learn/labs/nest-lifecycle
npm run learn          # mở http://127.0.0.1:3939
```

Bố cục học: đề bài bên trái, **bàn làm việc** bên phải (code, nút Chạy, test xanh/đỏ). Hợp nhất khi web ở màn phụ,
VS Code ở màn chính: sửa file TODO trong VS Code, bấm Chạy test bên web. Màn hẹp hơn 1280px thì thành một cột, nút chạy
nằm ngay trong từng bước, trang mốc có thanh test dính đáy.

Thứ tự học hiện tại: Bài 1 → Bài 2 → Mốc 1 (giữa mốc mở Bài 3).

## Lệnh hay dùng

| Việc | Lệnh |
| --- | --- |
| Mở web học | `npm run learn` (gốc repo) |
| Chạy test chấp nhận của mốc trong terminal | `cd api && npm test` |
| Chạy API | `cd api && npm start` → http://127.0.0.1:4000/api |
| Bật MySQL (từ mốc 2) | `cd api && docker compose up -d` |

## Thư mục

```
learn/
  roadmap.md        kế hoạch, mốc, trạng thái
  app/              web học (Next.js, chỉ chạy ở 127.0.0.1)
    src/features/lessons/constants/   nội dung bài lab và mốc
  labs/             harness chấm bài lab (node-basics, nest-lifecycle)
  journal/          tiến độ (progress.json) và phần giải thích lại của bro
api/                backend NestJS (lớn dần qua từng mốc)
```

Có thắc mắc thì hỏi Claude ngay trong terminal ở gốc repo. Claude đọc được `learn/journal/` nên biết bro đang hiểu sai
ở đâu.
