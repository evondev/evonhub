# Lộ trình: chuyển backend Evonhub sang NestJS + MySQL

Học backend bằng cách chuyển dần chính Evonhub, trên nhánh `learn/nest-api`, **chỉ chạy ở local, không đưa lên
production**. Claude đọc file này đầu mỗi phiên và cập nhật mục **Trạng thái** khi xong một mốc.

## Mục tiêu

Hiểu backend sâu như đã hiểu frontend: biết **vì sao**, không chỉ biết làm. Trọng tâm theo tin tuyển dụng Node.js:
NestJS (và đọc được Express thuần), MySQL, **authentication / JWT** (phần chủ repo thấy yếu nhất), Docker, CI/CD, AWS.

Song song là **tư duy system design**: nhìn một hệ thống là đoán được chỗ nào vỡ khi tải tăng hay khi một phần chết,
và chọn cách sửa đáng tiền nhất. Kiến thức (cache, queue, replica là gì) đọc là biết; tư duy chỉ có qua vòng
**quyết định → thấy hậu quả → hiểu vì sao**. Vòng đó lấy từ hai nguồn:

- **Game [GonnaCrash](https://200lab.io/en/mini-solutions/gonnacrash)** (200Lab): giả lập, rẻ, nhanh, cho trực giác về
  tải và thất bại. Không dạy mô hình dữ liệu, nghiệp vụ hay chuyển đổi hệ thống đang chạy.
- **Evonhub dưới tải giả lập**: Evonhub thật không bao giờ tự sập vì tải, nên phải tự bắn tải bằng `autocannon` vào
  `api/` local để thấy lỗi trong code, log và `EXPLAIN`.

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

0. **Khởi động bằng game** (mốc có ghi màn GonnaCrash): chơi màn đó trước để có trực giác về lỗi sắp gặp.
1. **Đề bài** (trang mốc trong web học): tính năng Evonhub nào, sau mốc này phần nào của app chạy qua API.
2. **Dự đoán** thiết kế trước khi thấy code: bảng, endpoint, chỗ dễ hỏng.
3. **Dựng**: Claude lo khung, cài đặt, file phụ, test chấp nhận. Chủ repo viết các chỗ `TODO (mốc X)`.
4. **Vấp**: mốc được thiết kế để chạm đúng một vấn đề. Mở bài lab của vấn đề đó (link ngay trong trang mốc).
5. **Xanh**: nút Chạy test ở bàn làm việc (hoặc `cd api && npm test`).
6. **Chạy thật**: bật module trong `API_MODULES`, mở Evonhub ở `localhost:3000`, dùng tính năng đó như học viên.
7. **Phá thử**, rồi **giải thích lại** vào `learn/journal/`.
8. **Phá bằng tải** (từ mốc 6): dự đoán con số trước (req/s, p99 latency, lỗi), bắn `autocannon`, sửa, đo lại. Ghi
   số đo trước/sau vào journal; số trong bài phải là số chạy thật trên máy này.

Cuối mỗi chặng: Claude **cài một bug** để chủ repo tự tìm không dùng AI, và **phỏng vấn thử** như nhà tuyển dụng.

Học trên web: `npm run learn` ở gốc repo, mở http://127.0.0.1:3939 (bố cục B: đề bài trái, bàn làm việc phải từ
1280px; hợp để web ở màn phụ, VS Code ở màn chính). Nội dung bài và mốc nằm ở
`learn/app/src/features/lessons/constants/`, tiến độ lưu ở `learn/journal/progress.json`.

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

Game và tải của chặng 3:

| # | Màn GonnaCrash khởi động | Phá bằng tải trên Evonhub |
| --- | --- | --- |
| 6 | Search hangs, the whole page waits | Bắn tải vào trang danh sách khoá học khi chưa có index, xem p99 rồi thêm index và đo lại |
| 7 | Flash sale on TV | Vài trăm request cùng dùng một mã coupon còn 1 lượt: đếm số đơn tạo được trước và sau khi sửa |
| 8 | Out of connections | Tăng số kết nối đồng thời vượt pool MySQL, xem request xếp hàng rồi timeout; sửa N+1 xem pool thở lại |
| 9 | Signup waits on email; Retry storm | Duyệt đơn hàng loạt khi mail gửi đồng bộ vs qua queue; cho worker chết giữa chừng, kiểm không gửi trùng mail |

### Chặng 4: Vận hành

| # | Mốc | Kết quả | Bài lab |
| --- | --- | --- | --- |
| 10 | Test + Docker | Unit/e2e cho luồng mua khoá; Dockerfile multi-stage, compose đủ api + MySQL + Redis | Container thực chất là process gì, layer, mạng giữa container, healthcheck |
| 11 | CI/CD | GitHub Actions chạy lint → test → build image trên nhánh này (không deploy) | Migration chạy ở bước nào, rollback |
| 12 | AWS | Chỉ local: dựng kiến trúc deploy bằng LocalStack (S3, SQS, Secrets Manager), vẽ sơ đồ ECS + RDS. Deploy thật để tuỳ chọn | VPC, security group, IAM quyền tối thiểu, quản lý secret |

### Chặng 5: System design dưới tải (local)

Cần compose của mốc 10. Mỗi mốc: chơi màn game, dự đoán, dựng trong compose, bắn tải, giết một phần hệ thống, đo.

| # | Mốc | Màn GonnaCrash | Kết quả | Bài lab |
| --- | --- | --- | --- | --- |
| 13 | Scale ngang | The Reddit post blows up; Hacker News night | 3 bản `api` sau nginx; tắt một bản giữa lúc bắn tải | Scale up vs scale out, health check, vì sao API phải stateless (nối JWT chặng 2), rolling deploy |
| 14 | Read replica | One primary, six thousand reads; The primary goes down | MySQL primary + replica trong compose; ghi xong đọc ngay từ replica; dừng primary | Replication lag, đọc-sau-ghi, failover, khi nào đọc phải đi primary |
| 15 | Phụ thuộc chậm | Search hangs, the whole page waits; Retry storm | Giả lập Clerk JWKS / Mux trả lời sau 10 giây; xem cả API treo theo hay không | Timeout, retry có backoff + jitter, circuit breaker, bulkhead |
| 16 | Chặn lạm dụng | Storm night; Surviving Black Friday | Rate limit API tạo đơn theo user/IP (Redis), trả 429 đúng chuẩn | Token bucket vs sliding window, rate limit ở nginx hay ở app, chống spam coupon |

## Trạng thái

- 2026-10-29 → 10-30: dựng app evon-lab (repo riêng), bài 1–3 và mốc 1. Chủ repo đã làm 2 bước đầu bài 1.
- 2026-11-02: **chuyển hết sang Evonhub**, nhánh `learn/nest-api`. Bài và mốc chuyển sang markdown ở `learn/`,
  `evonhub-api` thành `api/` (cổng 4000 để không trùng Next). Thêm Docker compose MySQL (cổng 3307).
  Roadmap đổi: auth thành chặng riêng 3 mốc (chủ repo yếu nhất phần JWT).
  Đã chạy thử: mọi bài lab chạy đúng (bài chỉ xem đạt, bài tập ở trạng thái gốc trượt), `api` test xanh 2/9 như thiết kế.
- 2026-11-02: thêm nhánh **system design**: game GonnaCrash làm bước khởi động, bước "phá bằng tải" bằng `autocannon`
  cho mốc 6–9, và chặng 5 (scale ngang, read replica, phụ thuộc chậm, rate limit). Trong lúc làm chặng 1–2, chủ repo
  chơi World 1 của game song song; chưa cần backend.
- 2026-11-02: **web học quay lại**, trong repo: app evon-lab chuyển vào `learn/app` (`npm run learn`, cổng 3939), dùng
  token Evonhub, bố cục B (đề bài trái, bàn làm việc phải: code, nút Chạy, test xanh/đỏ; dưới 1280px một cột + thanh
  test dính đáy). Bài lab chạy harness ở `learn/labs/`, test mốc chạy ở `api/`. Bỏ bản markdown của bài và mốc cùng
  `learn/labs/run.mjs` để nội dung chỉ có một nguồn (TS trong app). Tiến độ cũ (2 bước bài 1) giữ nguyên.
- **Việc tiếp theo**: chủ repo học bài 1–2 và làm mốc 1 (giữa mốc mở bài 3) trên web. Xong thì Claude đọc
  `learn/journal/` rồi viết mốc 2 (MySQL + `users` + script chuyển dữ liệu).
