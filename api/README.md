# api/ (evonhub-api)

Backend Evonhub viết lại bằng NestJS + MySQL, lớn dần theo từng mốc trong [learn/roadmap.md](../learn/roadmap.md).
Chỉ chạy local trên nhánh `learn/nest-api`; app Next vẫn dùng Mongo cho các module chưa chuyển.

```bash
npm install
docker compose up -d   # MySQL ở 127.0.0.1:3307 (cần từ mốc 2)
npm start              # build rồi chạy ở http://127.0.0.1:4000/api
npm test               # build rồi chạy mọi test chấp nhận (test/*.e2e.ts)
```

Thử nhanh: `curl -i http://127.0.0.1:4000/api/courses`.

## Cấu trúc

- `src/app.factory.ts`: dựng app (prefix `/api`, filter toàn cục). `main.ts` và test cùng dùng hàm này, để test chạy
  đúng app thật.
- `src/common/`: thứ dùng cho mọi request (request id, dạng lỗi chung).
- `src/<module>/`: mỗi tính năng một module Nest (controller, service).
- `test/milestone-XX.e2e.ts`: test chấp nhận của từng mốc, dùng `node:test` và `fetch` thật tới server.
