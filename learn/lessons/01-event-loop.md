# Bài 1 · Tại sao một request chậm làm treo cả server?

> Chặng 1 · Node runtime · khoảng 20 phút

Event loop, call stack và thread pool: thứ quyết định server Node phục vụ được bao nhiêu người cùng lúc.

## 01 · Đọc: Bối cảnh

Bro có một API nhỏ: `/hash` băm mật khẩu khi người dùng đăng ký, `/health` chỉ trả `ok` để load balancer biết server còn sống.

Trên máy bro mọi thứ chạy ngon. Lên production, cứ lúc đông người đăng ký là load balancer báo server "chết" vài giây rồi sống lại. Bài này tìm ra vì sao.

## 02 · Dự đoán: Dự đoán trước khi chạy

`solution.cjs`

```js
const http = require("node:http");
const crypto = require("node:crypto");

const server = http.createServer((request, response) => {
  if (request.url === "/hash") {
    const hash = crypto.pbkdf2Sync("matkhau123", "evon-salt", 1_000_000, 64, "sha512");
    response.end(hash.toString("hex"));
    return;
  }

  response.end("ok");
});

module.exports = server;
```

Gửi `/hash` (băm mất khoảng 350ms), 20ms sau gửi `/health`. `/health` trả về sau bao lâu?

- **A.** Gần như ngay, vì hai request độc lập với nhau
- **B.** Khoảng 330ms, phải đợi `/hash` băm xong
- **C.** Node tự mở luồng mới cho `/health`
- **D.** `/health` lỗi timeout

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ❌ sai: Độc lập về logic, nhưng chạy chung một luồng JavaScript. Luồng đó đang bận băm thì không ai nhận `/health`.
- **B** ✅ đúng: Node chạy code JS của bro trên một luồng duy nhất. `pbkdf2Sync` giữ luồng đó suốt thời gian băm, `/health` nằm chờ trong hàng đợi tới khi luồng rảnh.
- **C** ❌ sai: Đó là mô hình mỗi request một luồng (Java Servlet, PHP-FPM theo process). Node không làm vậy: mọi callback JS đều chạy trên cùng một luồng.
- **D** ❌ sai: Không lỗi, chỉ chậm. Nhưng nếu `/hash` mất 30 giây thì load balancer sẽ đánh dấu server chết vì `/health` không trả lời kịp, đúng triệu chứng ở đầu bài.

</details>

## 03 · Chạy code: Chạy thật để kiểm chứng

Code dưới đây chạy trên máy bro, trong một process riêng như server thật. Harness gửi `/hash`, 20ms sau gửi `/health`, rồi in mốc thời gian.

Code được chạy (chỉ đọc):

`solution.cjs`

```js
const http = require("node:http");
const crypto = require("node:crypto");

const server = http.createServer((request, response) => {
  if (request.url === "/hash") {
    const hash = crypto.pbkdf2Sync("matkhau123", "evon-salt", 1_000_000, 64, "sha512");
    response.end(hash.toString("hex"));
    return;
  }

  response.end("ok");
});

module.exports = server;
```

Chạy từ gốc repo:

```bash
node learn/labs/run.mjs blocking-observe
```

<details>
<summary>Đọc sau khi chạy đạt</summary>

`/health` xử lý mất chưa tới 1ms, nhưng phải chờ gần hết thời gian băm của `/hash`. Số đo khớp với dự đoán chưa?

</details>

## 04 · Mô hình từng bước: Bên trong: call stack, hàng đợi và thread pool

Đọc từng bước. Ở bước có câu hỏi, tự trả lời trước rồi mới mở đáp án.

`solution.cjs`

```js
 1 │ const http = require("node:http");
 2 │ const crypto = require("node:crypto");
 3 │ 
 4 │ const server = http.createServer((request, response) => {
 5 │   if (request.url === "/hash") {
 6 │     const hash = crypto.pbkdf2Sync("matkhau123", "evon-salt", 1_000_000, 64, "sha512");
 7 │     response.end(hash.toString("hex"));
 8 │     return;
 9 │   }
10 │ 
11 │   response.end("ok");
12 │ });
13 │ 
14 │ module.exports = server;
```

**Bước 1/10.** Server vừa khởi động. Call stack rỗng, event loop đứng chờ sự kiện mạng.

Call stack (luồng JS): _trống_  
Hàng đợi sự kiện: _trống_  
Thread pool (libuv): _trống_  
Đã trả về: _trống_

**Bước 2/10.** Request `/hash` tới. Event loop đặt callback xử lý vào hàng đợi.

Call stack (luồng JS): _trống_  
Hàng đợi sự kiện: **`request /hash`**  
Thread pool (libuv): _trống_  
Đã trả về: _trống_

**Bước 3/10.** Call stack đang rỗng nên event loop đưa callback lên chạy. Tới dòng 6, `pbkdf2Sync` bắt đầu băm. _(dòng 6)_

Call stack (luồng JS): `handler(/hash)` · **`pbkdf2Sync()`**  
Hàng đợi sự kiện: _trống_  
Thread pool (libuv): _trống_  
Đã trả về: _trống_

**Bước 4/10.** 20ms sau, request `/health` tới và vào hàng đợi. `pbkdf2Sync` vẫn đang chạy. _(dòng 6)_

Call stack (luồng JS): `handler(/hash)` · `pbkdf2Sync()`  
Hàng đợi sự kiện: **`request /health`**  
Thread pool (libuv): _trống_  
Đã trả về: _trống_

> ❓ Dừng lại ở đây.

Callback của `/health` sẽ được chạy lúc nào?

- **A.** Ngay bây giờ, Node tạm dừng `pbkdf2Sync` để chen vào
- **B.** Khi `pbkdf2Sync` xong và call stack rỗng
- **C.** Trên một luồng JS khác

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ❌ sai: JavaScript chạy theo kiểu run-to-completion: hàm đang chạy thì chạy tới hết, không ai chen ngang được.
- **B** ✅ đúng: Event loop chỉ lấy việc tiếp theo trong hàng đợi khi call stack rỗng.
- **C** ❌ sai: Code JS của bro chỉ có một luồng. Luồng phụ chỉ có trong thread pool của libuv, và chỉ nhận việc được giao qua API async.

</details>

**Bước 5/10.** Khoảng 350ms sau: băm xong, dòng 7 gửi kết quả, handler kết thúc. Call stack rỗng trở lại. _(dòng 7)_

Call stack (luồng JS): _trống_  
Hàng đợi sự kiện: `request /health`  
Thread pool (libuv): _trống_  
Đã trả về: **`/hash · 350ms`**

**Bước 6/10.** Giờ event loop mới lấy được `/health`. Dòng 11 chạy mất chưa tới 1ms… _(dòng 11)_

Call stack (luồng JS): **`handler(/health)`**  
Hàng đợi sự kiện: _trống_  
Thread pool (libuv): _trống_  
Đã trả về: `/hash · 350ms`

**Bước 7/10.** …nhưng người gọi `/health` đã chờ hơn 300ms. Một request nặng làm chậm mọi request khác.

Call stack (luồng JS): _trống_  
Hàng đợi sự kiện: _trống_  
Thread pool (libuv): _trống_  
Đã trả về: `/hash · 350ms` · **`/health · chờ 330ms`**

**Bước 8/10.** Giờ đổi dòng 6 sang bản async `crypto.pbkdf2(…, callback)`. Handler giao việc băm cho thread pool rồi kết thúc ngay.

Call stack (luồng JS): _trống_  
Hàng đợi sự kiện: _trống_  
Thread pool (libuv): **`băm cho /hash`**  
Đã trả về: _trống_

> ❓ Dừng lại ở đây.

Lúc này `/health` tới. Nó phải chờ bao lâu?

- **A.** Gần như không chờ, vì call stack đang rỗng
- **B.** Vẫn chờ khoảng 330ms, vì việc băm chưa xong

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ✅ đúng: Việc băm nằm ở thread pool, luồng JS rảnh nên event loop chạy `/health` ngay.
- **B** ❌ sai: Việc băm chưa xong thật, nhưng nó đang chạy trên luồng khác của thread pool. Luồng JS không phải đợi nó.

</details>

**Bước 9/10.** `/health` chạy và trả về ngay. Thread pool vẫn đang băm.

Call stack (luồng JS): `handler(/health)`  
Hàng đợi sự kiện: _trống_  
Thread pool (libuv): `băm cho /hash`  
Đã trả về: **`/health · chờ 1ms`**

**Bước 10/10.** Băm xong, thread pool đặt callback vào hàng đợi. Event loop chạy callback đó và gửi kết quả `/hash`. Không ai phải chờ ai.

Call stack (luồng JS): `callback của pbkdf2`  
Hàng đợi sự kiện: _trống_  
Thread pool (libuv): _trống_  
Đã trả về: `/health · chờ 1ms` · **`/hash · 350ms`**

## 05 · Tìm lỗi: Tìm chỗ chặn event loop

Endpoint xuất báo cáo dưới đây làm cả API chậm hẳn mỗi khi có người bấm Xuất. Chọn **mọi** dòng chặn event loop, rồi mở đáp án.

`reports.controller.js`

```js
 1 │ app.get("/reports/:id/export", async (request, response) => {
 2 │   const report = await db.reports.findById(request.params.id);
 3 │   const orders = await db.orders.findMany({ reportId: report.id }); // ~200.000 dòng
 4 │ 
 5 │   const csv = orders.map((order) => toCsvLine(order)).join("\n");
 6 │   const template = fs.readFileSync(`./templates/${report.template}.html`, "utf8");
 7 │ 
 8 │   await mailer.send(report.ownerEmail, { template, attachment: csv });
 9 │   response.json({ status: "sent" });
10 │ });
```

<details>
<summary>Ghi số dòng bro chọn ra giấy rồi mới mở</summary>

Dòng có vấn đề: **5, 6**

- **Dòng 2**: Ổn. Trong lúc chờ MySQL trả lời, luồng JS rảnh để xử lý request khác.
- **Dòng 3**: Ổn về event loop. Kéo 200.000 dòng vào RAM là chuyện khác (bộ nhớ), và nó làm dòng 5 nặng.
- **Dòng 5** 🐞: Chặn. `map` + `join` trên 200.000 phần tử là việc CPU chạy trên luồng JS. Hàm có `async` cũng không giúp: dòng này không có `await` nào để nhường luồng.
- **Dòng 6** 🐞: Chặn. `readFileSync` bắt luồng JS đứng chờ ổ đĩa. Trong handler dùng `await fs.promises.readFile(...)`; bản Sync chỉ hợp lúc khởi động server.
- **Dòng 8**: Ổn. Gửi mail qua mạng và có `await`.
- **Dòng 9**: Ổn.

Bẫy hay gặp nhất: nghĩ hàm có `async` là không chặn. `await` chỉ nhường luồng ở đúng chỗ nó chờ một việc I/O. Code đồng bộ (vòng lặp lớn, hàm `*Sync`) vẫn chiếm trọn luồng JS dù nằm trong hàm async.

</details>

## 06 · Chạy code: Sửa để /health không phải chờ

Sửa server để `/health` trả lời dưới 50ms kể cả khi `/hash` đang băm. `/hash` vẫn phải trả đúng mã băm như cũ.

File để sửa: [`learn/labs/exercises/blocking-fix/solution.cjs`](../labs/exercises/blocking-fix/solution.cjs). Code ban đầu:

`solution.cjs`

```js
const http = require("node:http");
const crypto = require("node:crypto");

const server = http.createServer((request, response) => {
  if (request.url === "/hash") {
    const hash = crypto.pbkdf2Sync("matkhau123", "evon-salt", 1_000_000, 64, "sha512");
    response.end(hash.toString("hex"));
    return;
  }

  response.end("ok");
});

module.exports = server;
```

Chạy từ gốc repo:

```bash
node learn/labs/run.mjs blocking-fix
```

<details>
<summary>Gợi ý 1</summary>

Module `crypto` có bản không đuôi `Sync` của hàm này, nhận thêm một callback ở cuối.

</details>

<details>
<summary>Gợi ý 2</summary>

`crypto.pbkdf2(password, salt, iterations, keylen, digest, (error, hash) => { ... })`. Gửi response bên trong callback.

</details>

<details>
<summary>Gợi ý 3</summary>

Giữ `return;` ngay sau lời gọi `crypto.pbkdf2`. Thiếu nó, code chạy tiếp xuống `response.end("ok")` và `/hash` trả về "ok" trước khi băm xong.

</details>

<details>
<summary>Đọc sau khi chạy đạt</summary>

Để ý số đo: `/hash` vẫn mất khoảng 350ms, việc băm không nhanh hơn chút nào. Thứ thay đổi là **ai phải chờ**: chỉ người gọi `/hash` chờ, người khác không bị kéo theo.

</details>

## 07 · Dự đoán: Đào sâu: thread pool có giới hạn

Bản async chạy ở thread pool. Nhưng pool đó lớn cỡ nào?

`solution.cjs`

```js
const crypto = require("node:crypto");

// Bỏ dấu // ở dòng dưới rồi chạy lại, so số đo hai lần:
// process.env.UV_THREADPOOL_SIZE = "8";

const startedAt = Date.now();

for (let userNumber = 1; userNumber <= 8; userNumber++) {
  crypto.pbkdf2("matkhau123", "evon-salt", 400_000, 64, "sha512", () => {
    console.log(`Người ${userNumber} băm xong sau ${Date.now() - startedAt}ms`);
  });
}
```

8 người đăng ký cùng lúc, 8 lần băm async cùng bắt đầu. Kết quả trả về theo kiểu nào?

- **A.** Cả 8 xong cùng lúc, vì đều chạy song song
- **B.** Xong thành 2 đợt, mỗi đợt 4 người
- **C.** Xong lần lượt từng người một
- **D.** Tuỳ số nhân CPU: máy 8 nhân thì cả 8 cùng xong

<details>
<summary>Chốt đáp án trong đầu rồi mới mở</summary>

- **A** ❌ sai: Thread pool của libuv mặc định chỉ có 4 luồng (biến `UV_THREADPOOL_SIZE`). 4 việc đầu chạy, 4 việc sau xếp hàng.
- **B** ✅ đúng: Pool có 4 luồng nên chạy 4 việc một lúc. Đợt 2 bắt đầu khi đợt 1 trả luồng.
- **C** ❌ sai: Đó là cảnh của bản `pbkdf2Sync`. Bản async chạy được nhiều việc song song, chỉ là có giới hạn.
- **D** ❌ sai: Số nhân quyết định mỗi lần băm nhanh hay chậm, không quyết định số luồng của pool. Máy 8 nhân hay 64 nhân thì pool vẫn là 4 nếu không chỉnh.

</details>

## 08 · Chạy code: Chạy để thấy hai đợt

Chạy một lần để kiểm chứng. Sau đó bỏ dấu `//` ở dòng `UV_THREADPOOL_SIZE` và chạy lại để so hai kết quả.

File để sửa: [`learn/labs/exercises/threadpool-observe/solution.cjs`](../labs/exercises/threadpool-observe/solution.cjs). Code ban đầu:

`solution.cjs`

```js
const crypto = require("node:crypto");

// Bỏ dấu // ở dòng dưới rồi chạy lại, so số đo hai lần:
// process.env.UV_THREADPOOL_SIZE = "8";

const startedAt = Date.now();

for (let userNumber = 1; userNumber <= 8; userNumber++) {
  crypto.pbkdf2("matkhau123", "evon-salt", 400_000, 64, "sha512", () => {
    console.log(`Người ${userNumber} băm xong sau ${Date.now() - startedAt}ms`);
  });
}
```

Chạy từ gốc repo:

```bash
node learn/labs/run.mjs threadpool-observe
```

<details>
<summary>Đọc sau khi chạy đạt</summary>

Pool 4 luồng cho hai cụm mốc thời gian. Tăng lên 8 thì cả 8 xong gần cùng lúc, nhưng mỗi lần băm lâu hơn vì 8 luồng giành nhau CPU. Pool to hơn không miễn phí.

</details>

## 09 · Đọc: Khi nào dùng gì

| Việc trong handler | Có chặn luồng JS? | Nên làm gì |
| --- | --- | --- |
| Query DB, gọi API khác qua mạng | Không, nếu có `await` | Giữ nguyên |
| Đọc, ghi file bằng hàm `*Sync` | Có | Dùng `fs.promises`; bản Sync chỉ để lúc khởi động |
| Băm mật khẩu, nén, mã hoá bằng API của Node | Không, nếu dùng bản async | Dùng bản async (chạy ở thread pool) |
| Vòng lặp lớn viết bằng JS | Có, kể cả trong hàm `async` | Chia nhỏ, dùng `worker_threads`, hoặc đẩy vào job queue |

Một chi tiết hay bị hỏi khi phỏng vấn: thread pool phục vụ `fs`, `crypto`, `zlib` và `dns.lookup`. Socket mạng (HTTP, kết nối MySQL) **không** dùng thread pool mà dùng cơ chế chờ sự kiện của hệ điều hành (epoll trên Linux, kqueue trên macOS). Vì vậy hàng nghìn kết nối đang chờ DB trả lời không chiếm luồng nào.

Job queue sẽ quay lại ở chặng Redis + BullMQ, khi làm phần gửi email thanh toán.

## 10 · Giải thích lại: Giải thích lại bằng lời của bro

Giải thích cho một bạn junior (5–7 câu): tại sao `pbkdf2Sync` trong handler làm chậm cả server, bản async khác gì, và khi nào `async/await` cũng không cứu được.

Viết vào `learn/journal/` (file cùng tên bài), rồi nhờ Claude đọc và sửa chỗ hiểu sai.

<details>
<summary>Viết xong rồi mới mở: tự đối chiếu</summary>

- [ ] Node chạy code JS trên một luồng; callback đang chạy thì chạy tới hết mới tới cái khác
- [ ] Hàm Sync giữ call stack, nên request khác phải nằm chờ trong hàng đợi
- [ ] Bản async giao việc cho thread pool của libuv, luồng JS rảnh ngay
- [ ] Thread pool mặc định 4 luồng, nên việc nặng vẫn xếp hàng ở đó
- [ ] Việc CPU viết bằng JS (vòng lặp lớn) thì `await` không giúp: cần chia nhỏ, worker_threads hoặc queue

</details>
