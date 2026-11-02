import type { CodeSnippet, Lesson, StepFlowLane } from "../../types/lesson";

const hashServerCode: CodeSnippet = {
  fileName: "solution.cjs",
  language: "javascript",
  source: `const http = require("node:http");
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
`,
};

const threadpoolCode: CodeSnippet = {
  fileName: "solution.cjs",
  language: "javascript",
  source: `const crypto = require("node:crypto");

// Bỏ dấu // ở dòng dưới rồi chạy lại, so số đo hai lần:
// process.env.UV_THREADPOOL_SIZE = "8";

const startedAt = Date.now();

for (let userNumber = 1; userNumber <= 8; userNumber++) {
  crypto.pbkdf2("matkhau123", "evon-salt", 400_000, 64, "sha512", () => {
    console.log(\`Người \${userNumber} băm xong sau \${Date.now() - startedAt}ms\`);
  });
}
`,
};

const reportExportCode: CodeSnippet = {
  fileName: "reports.controller.js",
  language: "javascript",
  source: `app.get("/reports/:id/export", async (request, response) => {
  const report = await db.reports.findById(request.params.id);
  const orders = await db.orders.findMany({ reportId: report.id }); // ~200.000 dòng

  const csv = orders.map((order) => toCsvLine(order)).join("\\n");
  const template = fs.readFileSync(\`./templates/\${report.template}.html\`, "utf8");

  await mailer.send(report.ownerEmail, { template, attachment: csv });
  response.json({ status: "sent" });
});
`,
};

const eventLoopLanes: StepFlowLane[] = [
  { id: "stack", title: "Call stack (luồng JS)" },
  { id: "queue", title: "Hàng đợi sự kiện" },
  { id: "pool", title: "Thread pool (libuv)" },
  { id: "done", title: "Đã trả về" },
];

export const eventLoopLesson: Lesson = {
  slug: "01-event-loop",
  number: 1,
  stage: "Chặng 1 · Node runtime",
  title: "Tại sao một request chậm làm treo cả server?",
  summary: "Event loop, call stack và thread pool: thứ quyết định server Node phục vụ được bao nhiêu người cùng lúc.",
  minutes: 20,
  steps: [
    {
      id: "context",
      kind: "prose",
      title: "Bối cảnh",
      body: `Bro có một API nhỏ: \`/hash\` băm mật khẩu khi người dùng đăng ký, \`/health\` chỉ trả \`ok\` để load balancer biết server còn sống.

Trên máy bro mọi thứ chạy ngon. Lên production, cứ lúc đông người đăng ký là load balancer báo server "chết" vài giây rồi sống lại. Bài này tìm ra vì sao.`,
    },
    {
      id: "predict-health",
      kind: "predict",
      title: "Dự đoán trước khi chạy",
      code: hashServerCode,
      question: {
        prompt: "Gửi `/hash` (băm mất khoảng 350ms), 20ms sau gửi `/health`. `/health` trả về sau bao lâu?",
        options: [
          {
            id: "instant",
            label: "Gần như ngay, vì hai request độc lập với nhau",
            explanation:
              "Độc lập về logic, nhưng chạy chung một luồng JavaScript. Luồng đó đang bận băm thì không ai nhận `/health`.",
            isCorrect: false,
          },
          {
            id: "wait",
            label: "Khoảng 330ms, phải đợi `/hash` băm xong",
            explanation:
              "Đúng. Node chạy code JS của bro trên một luồng duy nhất. `pbkdf2Sync` giữ luồng đó suốt thời gian băm, `/health` nằm chờ trong hàng đợi tới khi luồng rảnh.",
            isCorrect: true,
          },
          {
            id: "new-thread",
            label: "Node tự mở luồng mới cho `/health`",
            explanation:
              "Đó là mô hình mỗi request một luồng (Java Servlet, PHP-FPM theo process). Node không làm vậy: mọi callback JS đều chạy trên cùng một luồng.",
            isCorrect: false,
          },
          {
            id: "timeout",
            label: "`/health` lỗi timeout",
            explanation:
              "Không lỗi, chỉ chậm. Nhưng nếu `/hash` mất 30 giây thì load balancer sẽ đánh dấu server chết vì `/health` không trả lời kịp, đúng triệu chứng ở đầu bài.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "observe-blocking",
      kind: "code-task",
      taskId: "blocking-observe",
      title: "Chạy thật để kiểm chứng",
      prompt:
        "Code dưới đây chạy trên máy bro, trong một process riêng như server thật. Harness gửi `/hash`, 20ms sau gửi `/health`, rồi in mốc thời gian.",
      code: hashServerCode,
      isEditable: false,
      hints: [],
      afterPass:
        "`/health` xử lý mất chưa tới 1ms, nhưng phải chờ gần hết thời gian băm của `/hash`. Số đo khớp với dự đoán chưa?",
    },
    {
      id: "model-event-loop",
      kind: "step-flow",
      title: "Bên trong: call stack, hàng đợi và thread pool",
      intro: "Bấm từng bước. Ở bước có câu hỏi, trả lời xong mới đi tiếp được.",
      code: hashServerCode,
      lanes: eventLoopLanes,
      frames: [
        {
          caption: "Server vừa khởi động. Call stack rỗng, event loop đứng chờ sự kiện mạng.",
          lanes: {},
        },
        {
          caption: "Request `/hash` tới. Event loop đặt callback xử lý vào hàng đợi.",
          lanes: { queue: ["request /hash"] },
          focusItem: "request /hash",
        },
        {
          caption: "Call stack đang rỗng nên event loop đưa callback lên chạy. Tới dòng 6, `pbkdf2Sync` bắt đầu băm.",
          lanes: { stack: ["handler(/hash)", "pbkdf2Sync()"] },
          focusItem: "pbkdf2Sync()",
          activeLines: [6],
        },
        {
          caption: "20ms sau, request `/health` tới và vào hàng đợi. `pbkdf2Sync` vẫn đang chạy.",
          lanes: { stack: ["handler(/hash)", "pbkdf2Sync()"], queue: ["request /health"] },
          focusItem: "request /health",
          activeLines: [6],
          question: {
            prompt: "Callback của `/health` sẽ được chạy lúc nào?",
            options: [
              {
                id: "interrupt",
                label: "Ngay bây giờ, Node tạm dừng `pbkdf2Sync` để chen vào",
                explanation:
                  "JavaScript chạy theo kiểu run-to-completion: hàm đang chạy thì chạy tới hết, không ai chen ngang được.",
                isCorrect: false,
              },
              {
                id: "after",
                label: "Khi `pbkdf2Sync` xong và call stack rỗng",
                explanation: "Đúng. Event loop chỉ lấy việc tiếp theo trong hàng đợi khi call stack rỗng.",
                isCorrect: true,
              },
              {
                id: "other-thread",
                label: "Trên một luồng JS khác",
                explanation:
                  "Code JS của bro chỉ có một luồng. Luồng phụ chỉ có trong thread pool của libuv, và chỉ nhận việc được giao qua API async.",
                isCorrect: false,
              },
            ],
          },
        },
        {
          caption: "Khoảng 350ms sau: băm xong, dòng 7 gửi kết quả, handler kết thúc. Call stack rỗng trở lại.",
          lanes: { queue: ["request /health"], done: ["/hash · 350ms"] },
          focusItem: "/hash · 350ms",
          activeLines: [7],
        },
        {
          caption: "Giờ event loop mới lấy được `/health`. Dòng 11 chạy mất chưa tới 1ms…",
          lanes: { stack: ["handler(/health)"], done: ["/hash · 350ms"] },
          focusItem: "handler(/health)",
          activeLines: [11],
        },
        {
          caption: "…nhưng người gọi `/health` đã chờ hơn 300ms. Một request nặng làm chậm mọi request khác.",
          lanes: { done: ["/hash · 350ms", "/health · chờ 330ms"] },
          focusItem: "/health · chờ 330ms",
        },
        {
          caption:
            "Giờ đổi dòng 6 sang bản async `crypto.pbkdf2(…, callback)`. Handler giao việc băm cho thread pool rồi kết thúc ngay.",
          lanes: { pool: ["băm cho /hash"] },
          focusItem: "băm cho /hash",
          question: {
            prompt: "Lúc này `/health` tới. Nó phải chờ bao lâu?",
            options: [
              {
                id: "no-wait",
                label: "Gần như không chờ, vì call stack đang rỗng",
                explanation:
                  "Đúng. Việc băm nằm ở thread pool, luồng JS rảnh nên event loop chạy `/health` ngay.",
                isCorrect: true,
              },
              {
                id: "still-wait",
                label: "Vẫn chờ khoảng 330ms, vì việc băm chưa xong",
                explanation:
                  "Việc băm chưa xong thật, nhưng nó đang chạy trên luồng khác của thread pool. Luồng JS không phải đợi nó.",
                isCorrect: false,
              },
            ],
          },
        },
        {
          caption: "`/health` chạy và trả về ngay. Thread pool vẫn đang băm.",
          lanes: { stack: ["handler(/health)"], pool: ["băm cho /hash"], done: ["/health · chờ 1ms"] },
          focusItem: "/health · chờ 1ms",
        },
        {
          caption:
            "Băm xong, thread pool đặt callback vào hàng đợi. Event loop chạy callback đó và gửi kết quả `/hash`. Không ai phải chờ ai.",
          lanes: { stack: ["callback của pbkdf2"], done: ["/health · chờ 1ms", "/hash · 350ms"] },
          focusItem: "/hash · 350ms",
        },
      ],
    },
    {
      id: "spot-report",
      kind: "spot-bug",
      title: "Tìm chỗ chặn event loop",
      prompt:
        "Endpoint xuất báo cáo dưới đây làm cả API chậm hẳn mỗi khi có người bấm Xuất. Chọn **mọi** dòng chặn event loop, rồi bấm Kiểm tra.",
      code: reportExportCode,
      bugLines: [5, 6],
      lineNotes: {
        2: "Ổn. Trong lúc chờ MySQL trả lời, luồng JS rảnh để xử lý request khác.",
        3: "Ổn về event loop. Kéo 200.000 dòng vào RAM là chuyện khác (bộ nhớ), và nó làm dòng 5 nặng.",
        5: "Chặn. `map` + `join` trên 200.000 phần tử là việc CPU chạy trên luồng JS. Hàm có `async` cũng không giúp: dòng này không có `await` nào để nhường luồng.",
        6: "Chặn. `readFileSync` bắt luồng JS đứng chờ ổ đĩa. Trong handler dùng `await fs.promises.readFile(...)`; bản Sync chỉ hợp lúc khởi động server.",
        8: "Ổn. Gửi mail qua mạng và có `await`.",
        9: "Ổn.",
      },
      summary:
        "Bẫy hay gặp nhất: nghĩ hàm có `async` là không chặn. `await` chỉ nhường luồng ở đúng chỗ nó chờ một việc I/O. Code đồng bộ (vòng lặp lớn, hàm `*Sync`) vẫn chiếm trọn luồng JS dù nằm trong hàm async.",
    },
    {
      id: "fix-blocking",
      kind: "code-task",
      taskId: "blocking-fix",
      title: "Sửa để /health không phải chờ",
      prompt:
        "Sửa server để `/health` trả lời dưới 50ms kể cả khi `/hash` đang băm. `/hash` vẫn phải trả đúng mã băm như cũ.",
      code: hashServerCode,
      isEditable: true,
      hints: [
        "Module `crypto` có bản không đuôi `Sync` của hàm này, nhận thêm một callback ở cuối.",
        "`crypto.pbkdf2(password, salt, iterations, keylen, digest, (error, hash) => { ... })`. Gửi response bên trong callback.",
        'Giữ `return;` ngay sau lời gọi `crypto.pbkdf2`. Thiếu nó, code chạy tiếp xuống `response.end("ok")` và `/hash` trả về "ok" trước khi băm xong.',
      ],
      afterPass:
        "Để ý số đo: `/hash` vẫn mất khoảng 350ms, việc băm không nhanh hơn chút nào. Thứ thay đổi là **ai phải chờ**: chỉ người gọi `/hash` chờ, người khác không bị kéo theo.",
    },
    {
      id: "predict-threadpool",
      kind: "predict",
      title: "Đào sâu: thread pool có giới hạn",
      intro: "Bản async chạy ở thread pool. Nhưng pool đó lớn cỡ nào?",
      code: threadpoolCode,
      question: {
        prompt: "8 người đăng ký cùng lúc, 8 lần băm async cùng bắt đầu. Kết quả trả về theo kiểu nào?",
        options: [
          {
            id: "all-together",
            label: "Cả 8 xong cùng lúc, vì đều chạy song song",
            explanation:
              "Thread pool của libuv mặc định chỉ có 4 luồng (biến `UV_THREADPOOL_SIZE`). 4 việc đầu chạy, 4 việc sau xếp hàng.",
            isCorrect: false,
          },
          {
            id: "two-waves",
            label: "Xong thành 2 đợt, mỗi đợt 4 người",
            explanation: "Đúng. Pool có 4 luồng nên chạy 4 việc một lúc. Đợt 2 bắt đầu khi đợt 1 trả luồng.",
            isCorrect: true,
          },
          {
            id: "one-by-one",
            label: "Xong lần lượt từng người một",
            explanation:
              "Đó là cảnh của bản `pbkdf2Sync`. Bản async chạy được nhiều việc song song, chỉ là có giới hạn.",
            isCorrect: false,
          },
          {
            id: "by-cores",
            label: "Tuỳ số nhân CPU: máy 8 nhân thì cả 8 cùng xong",
            explanation:
              "Số nhân quyết định mỗi lần băm nhanh hay chậm, không quyết định số luồng của pool. Máy 8 nhân hay 64 nhân thì pool vẫn là 4 nếu không chỉnh.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "observe-threadpool",
      kind: "code-task",
      taskId: "threadpool-observe",
      title: "Chạy để thấy hai đợt",
      prompt:
        "Chạy một lần để kiểm chứng. Sau đó bỏ dấu `//` ở dòng `UV_THREADPOOL_SIZE` và chạy lại để so hai kết quả.",
      code: threadpoolCode,
      isEditable: true,
      hints: [],
      afterPass:
        "Pool 4 luồng cho hai cụm mốc thời gian. Tăng lên 8 thì cả 8 xong gần cùng lúc, nhưng mỗi lần băm lâu hơn vì 8 luồng giành nhau CPU. Pool to hơn không miễn phí.",
    },
    {
      id: "tradeoffs",
      kind: "prose",
      title: "Khi nào dùng gì",
      body: `| Việc trong handler | Có chặn luồng JS? | Nên làm gì |
| --- | --- | --- |
| Query DB, gọi API khác qua mạng | Không, nếu có \`await\` | Giữ nguyên |
| Đọc, ghi file bằng hàm \`*Sync\` | Có | Dùng \`fs.promises\`; bản Sync chỉ để lúc khởi động |
| Băm mật khẩu, nén, mã hoá bằng API của Node | Không, nếu dùng bản async | Dùng bản async (chạy ở thread pool) |
| Vòng lặp lớn viết bằng JS | Có, kể cả trong hàm \`async\` | Chia nhỏ, dùng \`worker_threads\`, hoặc đẩy vào job queue |

Một chi tiết hay bị hỏi khi phỏng vấn: thread pool phục vụ \`fs\`, \`crypto\`, \`zlib\` và \`dns.lookup\`. Socket mạng (HTTP, kết nối MySQL) **không** dùng thread pool mà dùng cơ chế chờ sự kiện của hệ điều hành (epoll trên Linux, kqueue trên macOS). Vì vậy hàng nghìn kết nối đang chờ DB trả lời không chiếm luồng nào.

Job queue sẽ quay lại ở chặng Redis + BullMQ, khi làm phần gửi email thanh toán.`,
    },
    {
      id: "explain-back",
      kind: "explain-back",
      title: "Giải thích lại bằng lời của bro",
      prompt:
        "Giải thích cho một bạn junior (5–7 câu): tại sao `pbkdf2Sync` trong handler làm chậm cả server, bản async khác gì, và khi nào `async/await` cũng không cứu được.",
      keyPoints: [
        "Node chạy code JS trên một luồng; callback đang chạy thì chạy tới hết mới tới cái khác",
        "Hàm Sync giữ call stack, nên request khác phải nằm chờ trong hàng đợi",
        "Bản async giao việc cho thread pool của libuv, luồng JS rảnh ngay",
        "Thread pool mặc định 4 luồng, nên việc nặng vẫn xếp hàng ở đó",
        "Việc CPU viết bằng JS (vòng lặp lớn) thì `await` không giúp: cần chia nhỏ, worker_threads hoặc queue",
      ],
    },
  ],
};
