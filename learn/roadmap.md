# Lộ trình: chuyển backend Evonhub sang NestJS + MySQL

Học backend bằng cách chuyển dần chính Evonhub, trên nhánh `learn/nest-api`, **chỉ chạy ở local, không đưa lên
production**. Claude đọc file này đầu mỗi phiên và cập nhật mục **Trạng thái** khi xong một mốc.

## Mục tiêu

Hiểu backend sâu như đã hiểu frontend: biết **vì sao**, không chỉ biết làm. Trọng tâm theo tin tuyển dụng Node.js:
NestJS (và đọc được Express thuần), MySQL, **authentication / JWT** (phần chủ repo thấy yếu nhất), Docker, CI/CD, AWS.

Ba phép thử "đã hiểu sâu":

1. **Dự đoán đúng** hệ thống phản ứng thế nào trước khi chạy.
2. **Giải thích được trade-off**: vì sao chọn cách này, không chọn cách kia.
3. **Tự sửa được khi hỏng**, không cần AI.

## Kiến trúc khi chạy local

```
Trình duyệt ─► Next.js :3000 ─► server action ─┬─► Mongoose ─► MongoDB          (module chưa chuyển)
                                                └─► fetch + Bearer token Clerk
                                                      └─► NestJS api :4000 ─► MySQL :3307 (Docker)
```

- **Chuyển từng module, app luôn chạy được.** Server action của module đã chuyển gọi `api/` thay vì Mongoose; module
  khác giữ nguyên.
- **Công tắc theo module**: biến `API_MODULES` trong `.env.local` (ví dụ `API_MODULES=me,courses`). Bỏ tên module ra
  là quay về Mongo ngay, để so hai bên khi nghi API trả sai.
- **Dữ liệu**: script đọc MongoDB local rồi đổ sang MySQL (`api/scripts/import-*.ts`). Chạy lại bao nhiêu lần cũng được.
- **Auth**: Clerk vẫn lo đăng nhập phía giao diện. API tự xác minh token Clerk, không tin bất cứ thứ gì client gửi.

## Cách học một mốc

1. **Đề bài** (`learn/milestones/mXX-*.md`): tính năng Evonhub nào, sau mốc này phần nào của app chạy qua API.
2. **Dự đoán** thiết kế trước khi thấy code: bảng, endpoint, chỗ dễ hỏng.
3. **Dựng**: Claude lo khung, cài đặt, file phụ, test chấp nhận. Chủ repo viết các chỗ `TODO (mốc X)`.
4. **Vấp**: mốc được thiết kế để chạm đúng một vấn đề. Mở bài lab (`learn/lessons/*.md`) của vấn đề đó.
5. **Xanh**: `cd api && npm test`.
6. **Chạy thật**: bật module trong `API_MODULES`, mở Evonhub ở `localhost:3000`, dùng tính năng đó như học viên.
7. **Phá thử**, rồi **giải thích lại** vào `learn/journal/`.

Cuối mỗi chặng: Claude **cài một bug** để chủ repo tự tìm không dùng AI, và **phỏng vấn thử** như nhà tuyển dụng.

Bài lab chạy bằng `node learn/labs/run.mjs <taskId>`. Câu dự đoán và đáp án nằm trong khối `<details>`: tự trả lời
trước rồi mới mở. Mở file `.md` bằng Markdown Preview của VS Code (`Cmd+Shift+V`).

## Các mốc

### Chặng 1: Nền và dữ liệu

| # | Mốc | Sau mốc này chạy thật | Sẽ vấp | Bài lab |
| --- | --- | --- | --- | --- |
| 1 | Khung API | `api/` chạy ở :4000, có request id, dạng lỗi chung, route khoá học (dữ liệu mẫu) | Framework làm gì trên module `http`? | Bài 3 mini-Express (đã có). Bài 1–2 là nền |
| 2 | MySQL và bảng `users` | Docker MySQL, migration, script chuyển user từ Mongo sang MySQL | Document Mongo tách thành bảng thế nào? Unique, khoá chính, kiểu dữ liệu | MySQL từ góc nhìn người quen Mongo: schema, migration, unique index |

### Chặng 2: Authentication (đào sâu nhất)

| # | Mốc | Sau mốc này chạy thật | Sẽ vấp | Bài lab |
| --- | --- | --- | --- | --- |
| 3 | JWT từ con số 0 | (lab) Tự ký và tự xác minh JWT bằng `node:crypto` | JWT thật ra chỉ là base64url + chữ ký? Sửa payload thì sao? `alg: none`? | Cấu tạo JWT, HS256 vs RS256, `exp` và lệch giờ, vì sao JWT khó thu hồi, session vs JWT |
| 4 | Access + refresh token | (lab, có test) Mini auth server: đăng nhập, access 15 phút, refresh xoay vòng, phát hiện refresh token bị dùng lại, đăng xuất | Refresh token bị đánh cắp thì phát hiện bằng cách nào? Lưu token ở đâu: cookie httpOnly hay localStorage? | Xoay vòng + token family, XSS vs CSRF, băm refresh token khi lưu DB (nối bài 1). Đối chiếu Clerk làm gì bên trong |
| 5 | API tin token Clerk | **Trang hồ sơ của Evonhub đọc qua API**: đăng nhập trên UI → server action gửi token → guard NestJS xác minh qua JWKS → `GET /api/me` từ MySQL | API xác minh token không cần gọi Clerk mỗi lần, vì sao? Role lấy từ token hay từ DB? | JWKS, kiểm `exp`/`iss`/`azp`, guard toàn cục + `@Public()` + `@Roles()` (nối bài 2), quyền dạng `create:course` của Evonhub, xác minh chữ ký webhook Clerk |

Phá thử của chặng 2: sửa một ký tự trong payload, token hết hạn, token của app Clerk khác, `jwt.decode` thay vì
`verify`, gọi thẳng API không token, đổi role trong token mà DB nói khác.

### Chặng 3: Nghiệp vụ thật

| # | Mốc | Sau mốc này chạy thật | Sẽ vấp | Bài lab |
| --- | --- | --- | --- | --- |
| 6 | Khoá học, chương, bài học | Trang khoá học và trang học đọc qua API | Document lồng nhau thành 3 bảng; trang chậm khi nhiều khoá | Index B-tree, index ghép, đọc `EXPLAIN` |
| 7 | Đơn hàng + coupon | Tạo đơn thanh toán thủ công qua API | Hai người cùng dùng mã cuối cùng | Transaction, isolation level, `FOR UPDATE` hay `UPDATE ... WHERE remaining > 0`, deadlock |
| 8 | Lịch sử học, tiến độ | Trang tiến độ và "khoá học của tôi" qua API | Trang chậm dần khi học viên học nhiều | N+1 query, connection pool, phân trang offset hay cursor |
| 9 | Email thanh toán qua queue | Duyệt đơn → email đi qua hàng đợi | Gửi mail trong request vừa chậm vừa dễ mất mail | Redis, BullMQ, retry an toàn bằng idempotency, cache-aside |

### Chặng 4: Vận hành

| # | Mốc | Kết quả | Bài lab |
| --- | --- | --- | --- |
| 10 | Test + Docker | Unit/e2e cho luồng mua khoá; Dockerfile multi-stage, compose đủ api + MySQL + Redis | Container thực chất là process gì, layer, mạng giữa container, healthcheck |
| 11 | CI/CD | GitHub Actions chạy lint → test → build image trên nhánh này (không deploy) | Migration chạy ở bước nào, rollback |
| 12 | AWS | Chỉ local: dựng kiến trúc deploy bằng LocalStack (S3, SQS, Secrets Manager), vẽ sơ đồ ECS + RDS. Deploy thật để tuỳ chọn | VPC, security group, IAM quyền tối thiểu, quản lý secret |

## Trạng thái

- 2026-10-29 → 10-30: dựng app evon-lab (repo riêng), bài 1–3 và mốc 1. Chủ repo đã làm 2 bước đầu bài 1.
- 2026-11-02: **chuyển hết sang Evonhub**, nhánh `learn/nest-api`. Bài và mốc chuyển sang markdown ở `learn/`,
  `evonhub-api` thành `api/` (cổng 4000 để không trùng Next). Thêm Docker compose MySQL (cổng 3307).
  Roadmap đổi: auth thành chặng riêng 3 mốc (chủ repo yếu nhất phần JWT).
  Đã chạy thử: mọi bài lab chạy đúng (bài chỉ xem đạt, bài tập ở trạng thái gốc trượt), `api` test xanh 2/9 như thiết kế.
- **Việc tiếp theo**: chủ repo học bài 1–3 (đọc `learn/lessons/`) và làm mốc 1. Xong thì Claude đọc `learn/journal/`
  rồi viết mốc 2 (MySQL + `users` + script chuyển dữ liệu).
