# Bài 2 · Một request đi qua những lớp nào trong NestJS?

> Chặng 2 · NestJS core · khoảng 20 phút

Middleware, guard, interceptor, pipe, exception filter: chạy theo thứ tự nào và việc nào đặt ở lớp nào.

## 01 · Đọc: Bối cảnh

API `POST /orders` tạo đơn mua khoá học. Trước khi tạo đơn, server cần làm 5 việc: ghi log, kiểm tra đăng nhập, kiểm tra body, đo thời gian xử lý, trả lỗi đúng dạng.

Viết hết vào handler thì handler nào cũng lặp lại 5 việc đó. NestJS tách mỗi việc vào một lớp riêng:

| Lớp | Việc | Gắn bằng |
| --- | --- | --- |
| Middleware | Ghi log, CORS, gắn request id | `consumer.apply(...)` trong module |
| Guard | Cho qua hay chặn (đăng nhập, phân quyền) | `@UseGuards()` |
| Interceptor | Bọc quanh handler: đo giờ, cache, đổi dạng response | `@UseInterceptors()` |
| Pipe | Kiểm tra, biến đổi tham số trước khi vào handler | `@Body(SomePipe)` |
| Exception filter | Biến lỗi thành response | `@Catch()` + `APP_FILTER` |

Câu hỏi của bài: các lớp này chạy theo thứ tự nào, và vì sao thứ tự đó quan trọng.

## 02 · Dự đoán: Dự đoán trước khi xem

`src/orders.controller.ts`

```ts
import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "./auth.guard.js";
import { CreateOrderBody, PositiveAmountPipe } from "./positive-amount.pipe.js";
import { TimingInterceptor } from "./timing.interceptor.js";
import { record } from "./trace.js";

@Controller("orders")
@UseGuards(AuthGuard)
@UseInterceptors(TimingInterceptor)
export class OrdersController {
  @Post()
  create(@Body(PositiveAmountPipe) body: CreateOrderBody) {
    record("handler");

    return { id: 1024, ...body };
  }
}
```

Gửi `POST /orders` **không có token** và body sai (`amount: -5`). Client nhận lỗi gì?

- **A.** 403 Forbidden: guard chặn trước
- **B.** 400 Bad Request: pipe báo amount sai
- **C.** Cả hai lỗi, gộp trong một response
- **D.** 201 Created: handler vẫn tạo đơn

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ✅ đúng: Guard chạy trước pipe. Guard trả `false` thì Nest ném `ForbiddenException` (403) và không gọi pipe nữa.
- **B** ❌ sai: Pipe chỉ chạy khi đã qua guard. Request không có token thì chưa tới được pipe.
- **C** ❌ sai: Nest dừng ở lỗi đầu tiên. Mỗi request chỉ có một exception đi tới filter.
- **D** ❌ sai: Guard trả `false` là request dừng lại. Handler không bao giờ chạy.

</details>

## 03 · Mô hình từng bước: Theo chân một request

Request có token đúng, body `{ amount: 499000 }`. Đọc từng bước để xem nó đi qua đâu.

`src/orders.controller.ts`

```ts
 1 │ import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
 2 │ import { AuthGuard } from "./auth.guard.js";
 3 │ import { CreateOrderBody, PositiveAmountPipe } from "./positive-amount.pipe.js";
 4 │ import { TimingInterceptor } from "./timing.interceptor.js";
 5 │ import { record } from "./trace.js";
 6 │ 
 7 │ @Controller("orders")
 8 │ @UseGuards(AuthGuard)
 9 │ @UseInterceptors(TimingInterceptor)
10 │ export class OrdersController {
11 │   @Post()
12 │   create(@Body(PositiveAmountPipe) body: CreateOrderBody) {
13 │     record("handler");
14 │ 
15 │     return { id: 1024, ...body };
16 │   }
17 │ }
```

**Bước 1/10.** Request `POST /orders` tới server.

Các lớp: `Middleware` · `Guard` · `Interceptor` · `Pipe` · `Handler` · `Exception filter`  
Đã chạy: _trống_  
Client nhận: _trống_

**Bước 2/10.** Middleware chạy đầu tiên. Lúc này Nest chưa xác định handler nào sẽ xử lý, nên middleware chỉ hợp với việc chung: ghi log, CORS.

Các lớp: **`Middleware`** · `Guard` · `Interceptor` · `Pipe` · `Handler` · `Exception filter`  
Đã chạy: `middleware`  
Client nhận: _trống_

**Bước 3/10.** Guard chạy. Khác middleware, guard biết handler sắp chạy (qua `ExecutionContext`), nên đọc được metadata như `@Roles('admin')` gắn trên handler. _(dòng 8)_

Các lớp: `Middleware` · **`Guard`** · `Interceptor` · `Pipe` · `Handler` · `Exception filter`  
Đã chạy: `middleware` · `guard`  
Client nhận: _trống_

> ❓ Dừng lại ở đây.

Nếu guard trả về `false`, chuyện gì xảy ra tiếp?

- **A.** Nest ném 403, bỏ qua interceptor, pipe và handler
- **B.** Pipe vẫn chạy để kiểm tra body
- **C.** Handler chạy nhưng trả về rỗng

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ✅ đúng: Lỗi đi thẳng tới exception filter, các lớp sau không chạy.
- **B** ❌ sai: Pipe nằm sau guard. Guard đã chặn thì request không tới được pipe.
- **C** ❌ sai: Handler không bao giờ được gọi khi guard trả `false`.

</details>

**Bước 4/10.** Có token đúng nên guard cho qua. Interceptor chạy phần **trước** handler: bắt đầu đo giờ. _(dòng 9)_

Các lớp: `Middleware` · `Guard` · **`Interceptor`** · `Pipe` · `Handler` · `Exception filter`  
Đã chạy: `middleware` · `guard` · `interceptor (trước)`  
Client nhận: _trống_

**Bước 5/10.** Pipe kiểm tra body: `amount` là số dương, hợp lệ. Pipe gắn với từng tham số nên chạy ngay trước handler. _(dòng 12)_

Các lớp: `Middleware` · `Guard` · `Interceptor` · **`Pipe`** · `Handler` · `Exception filter`  
Đã chạy: `middleware` · `guard` · `interceptor (trước)` · `pipe`  
Client nhận: _trống_

**Bước 6/10.** Handler tạo đơn. _(dòng 13, 15)_

Các lớp: `Middleware` · `Guard` · `Interceptor` · `Pipe` · **`Handler`** · `Exception filter`  
Đã chạy: `middleware` · `guard` · `interceptor (trước)` · `pipe` · `handler`  
Client nhận: _trống_

**Bước 7/10.** Interceptor chạy phần **sau** handler: ghi thời gian xử lý. Interceptor bọc quanh handler, có cả phần trước lẫn phần sau. _(dòng 9)_

Các lớp: `Middleware` · `Guard` · **`Interceptor`** · `Pipe` · `Handler` · `Exception filter`  
Đã chạy: `middleware` · `guard` · `interceptor (trước)` · `pipe` · `handler` · `interceptor (sau)`  
Client nhận: _trống_

**Bước 8/10.** Không có lỗi nên exception filter không chạy. Client nhận 201.

Các lớp: `Middleware` · `Guard` · `Interceptor` · `Pipe` · `Handler` · `Exception filter`  
Đã chạy: `middleware` · `guard` · `interceptor (trước)` · `pipe` · `handler` · `interceptor (sau)`  
Client nhận: **`201 Created`**

**Bước 9/10.** Đổi sang body sai (`amount: -5`), vẫn có token: middleware → guard → interceptor (trước) → pipe ném `BadRequestException`. _(dòng 12)_

Các lớp: `Middleware` · `Guard` · `Interceptor` · **`Pipe`** · `Handler` · `Exception filter`  
Đã chạy: `middleware` · `guard` · `interceptor (trước)` · `pipe`  
Client nhận: _trống_

> ❓ Dừng lại ở đây.

Pipe vừa ném lỗi. Phần **sau** của interceptor có chạy không?

- **A.** Không, lỗi đi thẳng tới exception filter
- **B.** Có, interceptor luôn chạy cả trước lẫn sau

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ✅ đúng: Phần sau gắn bằng `tap()` của RxJS, chỉ chạy khi handler trả về giá trị. Muốn chạy cả khi lỗi thì dùng `finalize()` hoặc `catchError()`.
- **B** ❌ sai: Chỉ khi viết bằng `finalize()`. Interceptor trong bài dùng `tap()`, nên khi có lỗi phần sau bị bỏ qua. Bước chạy thật ở dưới sẽ cho bro thấy.

</details>

**Bước 10/10.** Exception filter biến lỗi thành response 400. Thứ tự bro vừa xem là thứ tự harness sẽ in ra ở bước sau.

Các lớp: `Middleware` · `Guard` · `Interceptor` · `Pipe` · `Handler` · **`Exception filter`**  
Đã chạy: `middleware` · `guard` · `interceptor (trước)` · `pipe` · `exception filter`  
Client nhận: `400 Bad Request`

## 04 · Chạy code: Chạy app NestJS thật

Harness dựng app từ code này, gửi 4 request (đủ các ca token đúng/sai, body đúng/sai) rồi in thứ tự các lớp đã chạy. Mỗi lớp ghi tên mình vào `trace` khi chạy.

Code được chạy (chỉ đọc):

`src/orders.controller.ts`

```ts
import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "./auth.guard.js";
import { CreateOrderBody, PositiveAmountPipe } from "./positive-amount.pipe.js";
import { TimingInterceptor } from "./timing.interceptor.js";
import { record } from "./trace.js";

@Controller("orders")
@UseGuards(AuthGuard)
@UseInterceptors(TimingInterceptor)
export class OrdersController {
  @Post()
  create(@Body(PositiveAmountPipe) body: CreateOrderBody) {
    record("handler");

    return { id: 1024, ...body };
  }
}
```

Chạy từ gốc repo:

```bash
node learn/labs/run.mjs nest-observe
```

<details>
<summary>Đọc sau khi chạy đạt</summary>

So từng dòng với animation ở trên. Dòng nào làm bro bất ngờ thì đó là chỗ đáng hỏi lại.

</details>

## 05 · Tìm lỗi: Tìm lỗ hổng trong guard

Guard này bảo vệ trang admin. Một dev thêm một dòng để "tiện test trên Postman". Chọn dòng có lỗ hổng rồi mở đáp án.

`src/admin.guard.ts`

```ts
 1 │ @Injectable()
 2 │ export class AdminGuard implements CanActivate {
 3 │   canActivate(context: ExecutionContext): boolean {
 4 │     const request = context.switchToHttp().getRequest();
 5 │     const user = request.user; // AuthGuard đã gắn user vào request
 6 │ 
 7 │     if (!user) return false;
 8 │ 
 9 │     const role = request.headers["x-role"] ?? user.role;
10 │ 
11 │     return role === "admin";
12 │   }
13 │ }
```

<details>
<summary>Ghi số dòng bro chọn ra giấy rồi mới mở</summary>

Dòng có vấn đề: **9**

- **Dòng 5**: Ổn. Đọc user mà AuthGuard đã xác thực từ token.
- **Dòng 7**: Ổn. Chưa đăng nhập thì chặn.
- **Dòng 9** 🐞: Lỗ hổng. Header do client tự gửi: ai cũng thêm được `x-role: admin` bằng curl hay Postman. Quyền chỉ được đọc từ dữ liệu server đã xác thực (`user.role` lấy từ token hoặc DB).
- **Dòng 11**: Ổn, nếu `role` lấy từ nguồn tin cậy.

Mọi thứ đến từ request (header, body, query, cookie chưa ký) đều do client kiểm soát. Guard chỉ được quyết định dựa trên thứ server đã xác thực.

</details>

## 06 · Chạy code: Viết AuthGuard

Guard đang cho mọi request đi qua. Sửa để chỉ cho qua khi header `Authorization` đúng bằng `Bearer lab-token`. Harness kiểm tra cả **thứ tự**: request không token mà body sai phải nhận 403, không phải 400.

File để sửa: [`learn/labs/exercises/nest-guard/auth.guard.ts`](../labs/exercises/nest-guard/auth.guard.ts). Code ban đầu:

`src/auth.guard.ts`

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { record } from "./trace.js";

const LAB_TOKEN = "lab-token";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    record("guard");

    // TODO: chỉ cho qua khi header Authorization đúng bằng "Bearer lab-token".
    return true;
  }
}
```

Chạy từ gốc repo:

```bash
node learn/labs/run.mjs nest-guard
```

<details>
<summary>Gợi ý 1</summary>

Lấy request bằng `context.switchToHttp().getRequest()`.

</details>

<details>
<summary>Gợi ý 2</summary>

Node chuyển tên header về chữ thường: đọc `request.headers.authorization`, không phải `request.headers.Authorization`.

</details>

<details>
<summary>Gợi ý 3</summary>

``return request.headers.authorization === `Bearer ${LAB_TOKEN}`;``

</details>

<details>
<summary>Đọc sau khi chạy đạt</summary>

Để ý check thứ ba: guard viết đúng thì pipe không bao giờ thấy body của người chưa đăng nhập. Đó là lý do xác thực nằm ở guard, không ở pipe hay trong handler.

</details>

## 07 · Dự đoán: Đào sâu: đặt guard ở đâu

API có 30 controller. Mọi route cần đăng nhập, trừ `/health` và `/auth/login`. Đặt AuthGuard thế nào?

- **A.** Gắn `@UseGuards(AuthGuard)` lên từng controller
- **B.** Đăng ký guard toàn cục (`APP_GUARD`), đánh dấu route mở bằng `@Public()`
- **C.** Kiểm tra token trong middleware
- **D.** Kiểm tra token ở đầu mỗi handler

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ❌ sai: Chạy được, nhưng an toàn phụ thuộc vào trí nhớ: controller thứ 31 quên gắn là mở toang. Lỗi kiểu này không ai thấy cho tới khi bị khai thác.
- **B** ✅ đúng: Mặc định là đóng, muốn mở phải ghi rõ. Quên `@Public()` thì route bị khoá: lỗi lộ ra ngay lúc test chứ không âm thầm. Guard đọc `@Public()` qua `Reflector`, việc middleware không làm được.
- **C** ❌ sai: Middleware không biết handler nào sẽ chạy nên không đọc được `@Public()`. Muốn bỏ qua `/health` phải liệt kê đường dẫn bằng tay, dễ lệch khi đổi route.
- **D** ❌ sai: Lặp lại 30 lần và cũng dựa vào trí nhớ. Đây chính là cách server action hay làm khi gọi `auth()` ở đầu mỗi hàm.

</details>

## 08 · Đọc: Việc nào đặt ở lớp nào

Câu hỏi để chọn lớp: **việc này cần biết gì?**

- Chỉ cần request thô (URL, header) → **middleware**.
- Cần biết handler nào sắp chạy và metadata của nó → **guard** (cho qua hay không) hoặc **interceptor** (bọc trước và sau).
- Cần một tham số cụ thể của handler → **pipe**.
- Cần biết lỗi gì đã xảy ra → **exception filter**.

Liên hệ Evonhub: server action gọi `auth()` ở đầu từng hàm. Đó là guard viết tay nằm trong handler. Nó chạy được, nhưng quên một chỗ là thủng, và không có chỗ nào gom các quy tắc phân quyền lại. NestJS đẩy việc đó ra một lớp riêng để đặt mặc định an toàn.

## 09 · Giải thích lại: Giải thích lại bằng lời của bro

Kể lại hành trình của request `POST /orders` không có token và body sai, qua từng lớp. Rồi giải thích vì sao xác thực nên đặt ở guard, không ở middleware hay trong handler.

Viết vào `learn/journal/` (file cùng tên bài), rồi nhờ Claude đọc và sửa chỗ hiểu sai.

<details>
<summary>Viết xong rồi mới mở: tự đối chiếu</summary>

- [ ] Thứ tự: middleware → guard → interceptor (trước) → pipe → handler → interceptor (sau)
- [ ] Guard trả false thì Nest ném 403, các lớp sau không chạy, exception filter nhận lỗi
- [ ] Guard biết handler sắp chạy (ExecutionContext + Reflector) nên đọc được @Public, @Roles
- [ ] Middleware chỉ thấy request thô, không biết handler
- [ ] Guard toàn cục cho mặc định là đóng, route mở phải ghi rõ
- [ ] Quyền chỉ lấy từ dữ liệu server đã xác thực, không lấy từ header client gửi

</details>
