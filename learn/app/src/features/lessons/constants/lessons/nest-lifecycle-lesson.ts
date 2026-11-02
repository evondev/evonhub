import type { CodeSnippet, Lesson, StepFlowLane } from "../../types/lesson";

const ordersControllerCode: CodeSnippet = {
  fileName: "src/orders.controller.ts",
  language: "typescript",
  source: `import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
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
`,
};

const authGuardStarterCode: CodeSnippet = {
  fileName: "src/auth.guard.ts",
  language: "typescript",
  source: `import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
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
`,
};

const adminGuardCode: CodeSnippet = {
  fileName: "src/admin.guard.ts",
  language: "typescript",
  source: `@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // AuthGuard đã gắn user vào request

    if (!user) return false;

    const role = request.headers["x-role"] ?? user.role;

    return role === "admin";
  }
}
`,
};

const pipelineLayers = ["Middleware", "Guard", "Interceptor", "Pipe", "Handler", "Exception filter"];

const lifecycleLanes: StepFlowLane[] = [
  { id: "pipeline", title: "Các lớp" },
  { id: "trace", title: "Đã chạy" },
  { id: "response", title: "Client nhận" },
];

export const nestLifecycleLesson: Lesson = {
  slug: "02-nest-request-lifecycle",
  number: 2,
  stage: "Chặng 2 · NestJS core",
  title: "Một request đi qua những lớp nào trong NestJS?",
  summary: "Middleware, guard, interceptor, pipe, exception filter: chạy theo thứ tự nào và việc nào đặt ở lớp nào.",
  minutes: 20,
  steps: [
    {
      id: "context",
      kind: "prose",
      title: "Bối cảnh",
      body: `API \`POST /orders\` tạo đơn mua khoá học. Trước khi tạo đơn, server cần làm 5 việc: ghi log, kiểm tra đăng nhập, kiểm tra body, đo thời gian xử lý, trả lỗi đúng dạng.

Viết hết vào handler thì handler nào cũng lặp lại 5 việc đó. NestJS tách mỗi việc vào một lớp riêng:

| Lớp | Việc | Gắn bằng |
| --- | --- | --- |
| Middleware | Ghi log, CORS, gắn request id | \`consumer.apply(...)\` trong module |
| Guard | Cho qua hay chặn (đăng nhập, phân quyền) | \`@UseGuards()\` |
| Interceptor | Bọc quanh handler: đo giờ, cache, đổi dạng response | \`@UseInterceptors()\` |
| Pipe | Kiểm tra, biến đổi tham số trước khi vào handler | \`@Body(SomePipe)\` |
| Exception filter | Biến lỗi thành response | \`@Catch()\` + \`APP_FILTER\` |

Câu hỏi của bài: các lớp này chạy theo thứ tự nào, và vì sao thứ tự đó quan trọng.`,
    },
    {
      id: "predict-no-token",
      kind: "predict",
      title: "Dự đoán trước khi xem",
      code: ordersControllerCode,
      question: {
        prompt: "Gửi `POST /orders` **không có token** và body sai (`amount: -5`). Client nhận lỗi gì?",
        options: [
          {
            id: "forbidden",
            label: "403 Forbidden: guard chặn trước",
            explanation:
              "Đúng. Guard chạy trước pipe. Guard trả `false` thì Nest ném `ForbiddenException` (403) và không gọi pipe nữa.",
            isCorrect: true,
          },
          {
            id: "bad-request",
            label: "400 Bad Request: pipe báo amount sai",
            explanation: "Pipe chỉ chạy khi đã qua guard. Request không có token thì chưa tới được pipe.",
            isCorrect: false,
          },
          {
            id: "both",
            label: "Cả hai lỗi, gộp trong một response",
            explanation: "Nest dừng ở lỗi đầu tiên. Mỗi request chỉ có một exception đi tới filter.",
            isCorrect: false,
          },
          {
            id: "created",
            label: "201 Created: handler vẫn tạo đơn",
            explanation: "Guard trả `false` là request dừng lại. Handler không bao giờ chạy.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "model-lifecycle",
      kind: "step-flow",
      title: "Theo chân một request",
      intro: "Request có token đúng, body `{ amount: 499000 }`. Bấm từng bước để xem nó đi qua đâu.",
      code: ordersControllerCode,
      lanes: lifecycleLanes,
      frames: [
        {
          caption: "Request `POST /orders` tới server.",
          lanes: { pipeline: pipelineLayers },
        },
        {
          caption:
            "Middleware chạy đầu tiên. Lúc này Nest chưa xác định handler nào sẽ xử lý, nên middleware chỉ hợp với việc chung: ghi log, CORS.",
          lanes: { pipeline: pipelineLayers, trace: ["middleware"] },
          focusItem: "Middleware",
        },
        {
          caption:
            "Guard chạy. Khác middleware, guard biết handler sắp chạy (qua `ExecutionContext`), nên đọc được metadata như `@Roles('admin')` gắn trên handler.",
          lanes: { pipeline: pipelineLayers, trace: ["middleware", "guard"] },
          focusItem: "Guard",
          activeLines: [8],
          question: {
            prompt: "Nếu guard trả về `false`, chuyện gì xảy ra tiếp?",
            options: [
              {
                id: "stop",
                label: "Nest ném 403, bỏ qua interceptor, pipe và handler",
                explanation: "Đúng. Lỗi đi thẳng tới exception filter, các lớp sau không chạy.",
                isCorrect: true,
              },
              {
                id: "pipe-runs",
                label: "Pipe vẫn chạy để kiểm tra body",
                explanation: "Pipe nằm sau guard. Guard đã chặn thì request không tới được pipe.",
                isCorrect: false,
              },
              {
                id: "empty",
                label: "Handler chạy nhưng trả về rỗng",
                explanation: "Handler không bao giờ được gọi khi guard trả `false`.",
                isCorrect: false,
              },
            ],
          },
        },
        {
          caption: "Có token đúng nên guard cho qua. Interceptor chạy phần **trước** handler: bắt đầu đo giờ.",
          lanes: { pipeline: pipelineLayers, trace: ["middleware", "guard", "interceptor (trước)"] },
          focusItem: "Interceptor",
          activeLines: [9],
        },
        {
          caption: "Pipe kiểm tra body: `amount` là số dương, hợp lệ. Pipe gắn với từng tham số nên chạy ngay trước handler.",
          lanes: { pipeline: pipelineLayers, trace: ["middleware", "guard", "interceptor (trước)", "pipe"] },
          focusItem: "Pipe",
          activeLines: [12],
        },
        {
          caption: "Handler tạo đơn.",
          lanes: { pipeline: pipelineLayers, trace: ["middleware", "guard", "interceptor (trước)", "pipe", "handler"] },
          focusItem: "Handler",
          activeLines: [13, 15],
        },
        {
          caption:
            "Interceptor chạy phần **sau** handler: ghi thời gian xử lý. Interceptor bọc quanh handler, có cả phần trước lẫn phần sau.",
          lanes: {
            pipeline: pipelineLayers,
            trace: ["middleware", "guard", "interceptor (trước)", "pipe", "handler", "interceptor (sau)"],
          },
          focusItem: "Interceptor",
          activeLines: [9],
        },
        {
          caption: "Không có lỗi nên exception filter không chạy. Client nhận 201.",
          lanes: {
            pipeline: pipelineLayers,
            trace: ["middleware", "guard", "interceptor (trước)", "pipe", "handler", "interceptor (sau)"],
            response: ["201 Created"],
          },
          focusItem: "201 Created",
        },
        {
          caption:
            "Đổi sang body sai (`amount: -5`), vẫn có token: middleware → guard → interceptor (trước) → pipe ném `BadRequestException`.",
          lanes: { pipeline: pipelineLayers, trace: ["middleware", "guard", "interceptor (trước)", "pipe"] },
          focusItem: "Pipe",
          activeLines: [12],
          question: {
            prompt: "Pipe vừa ném lỗi. Phần **sau** của interceptor có chạy không?",
            options: [
              {
                id: "no",
                label: "Không, lỗi đi thẳng tới exception filter",
                explanation:
                  "Đúng. Phần sau gắn bằng `tap()` của RxJS, chỉ chạy khi handler trả về giá trị. Muốn chạy cả khi lỗi thì dùng `finalize()` hoặc `catchError()`.",
                isCorrect: true,
              },
              {
                id: "yes",
                label: "Có, interceptor luôn chạy cả trước lẫn sau",
                explanation:
                  "Chỉ khi viết bằng `finalize()`. Interceptor trong bài dùng `tap()`, nên khi có lỗi phần sau bị bỏ qua. Bước chạy thật ở dưới sẽ cho bro thấy.",
                isCorrect: false,
              },
            ],
          },
        },
        {
          caption:
            "Exception filter biến lỗi thành response 400. Thứ tự bro vừa xem là thứ tự harness sẽ in ra ở bước sau.",
          lanes: {
            pipeline: pipelineLayers,
            trace: ["middleware", "guard", "interceptor (trước)", "pipe", "exception filter"],
            response: ["400 Bad Request"],
          },
          focusItem: "Exception filter",
        },
      ],
    },
    {
      id: "observe-lifecycle",
      kind: "code-task",
      taskId: "nest-observe",
      title: "Chạy app NestJS thật",
      prompt:
        "Harness dựng app từ code này, gửi 4 request (đủ các ca token đúng/sai, body đúng/sai) rồi in thứ tự các lớp đã chạy. Mỗi lớp ghi tên mình vào `trace` khi chạy.",
      code: ordersControllerCode,
      isEditable: false,
      hints: [],
      afterPass:
        "So từng dòng với animation ở trên. Dòng nào làm bro bất ngờ thì đó là chỗ đáng hỏi lại.",
    },
    {
      id: "spot-admin-guard",
      kind: "spot-bug",
      title: "Tìm lỗ hổng trong guard",
      prompt:
        'Guard này bảo vệ trang admin. Một dev thêm một dòng để "tiện test trên Postman". Chọn dòng có lỗ hổng rồi bấm Kiểm tra.',
      code: adminGuardCode,
      bugLines: [9],
      lineNotes: {
        5: "Ổn. Đọc user mà AuthGuard đã xác thực từ token.",
        7: "Ổn. Chưa đăng nhập thì chặn.",
        9: "Lỗ hổng. Header do client tự gửi: ai cũng thêm được `x-role: admin` bằng curl hay Postman. Quyền chỉ được đọc từ dữ liệu server đã xác thực (`user.role` lấy từ token hoặc DB).",
        11: "Ổn, nếu `role` lấy từ nguồn tin cậy.",
      },
      summary:
        "Mọi thứ đến từ request (header, body, query, cookie chưa ký) đều do client kiểm soát. Guard chỉ được quyết định dựa trên thứ server đã xác thực.",
    },
    {
      id: "fix-auth-guard",
      kind: "code-task",
      taskId: "nest-guard",
      title: "Viết AuthGuard",
      prompt:
        "Guard đang cho mọi request đi qua. Sửa để chỉ cho qua khi header `Authorization` đúng bằng `Bearer lab-token`. Harness kiểm tra cả **thứ tự**: request không token mà body sai phải nhận 403, không phải 400.",
      code: authGuardStarterCode,
      isEditable: true,
      hints: [
        "Lấy request bằng `context.switchToHttp().getRequest()`.",
        "Node chuyển tên header về chữ thường: đọc `request.headers.authorization`, không phải `request.headers.Authorization`.",
        "``return request.headers.authorization === `Bearer ${LAB_TOKEN}`;``",
      ],
      afterPass:
        "Để ý check thứ ba: guard viết đúng thì pipe không bao giờ thấy body của người chưa đăng nhập. Đó là lý do xác thực nằm ở guard, không ở pipe hay trong handler.",
    },
    {
      id: "predict-global-guard",
      kind: "predict",
      title: "Đào sâu: đặt guard ở đâu",
      question: {
        prompt:
          "API có 30 controller. Mọi route cần đăng nhập, trừ `/health` và `/auth/login`. Đặt AuthGuard thế nào?",
        options: [
          {
            id: "per-controller",
            label: "Gắn `@UseGuards(AuthGuard)` lên từng controller",
            explanation:
              "Chạy được, nhưng an toàn phụ thuộc vào trí nhớ: controller thứ 31 quên gắn là mở toang. Lỗi kiểu này không ai thấy cho tới khi bị khai thác.",
            isCorrect: false,
          },
          {
            id: "global",
            label: "Đăng ký guard toàn cục (`APP_GUARD`), đánh dấu route mở bằng `@Public()`",
            explanation:
              "Đúng. Mặc định là đóng, muốn mở phải ghi rõ. Quên `@Public()` thì route bị khoá: lỗi lộ ra ngay lúc test chứ không âm thầm. Guard đọc `@Public()` qua `Reflector`, việc middleware không làm được.",
            isCorrect: true,
          },
          {
            id: "middleware",
            label: "Kiểm tra token trong middleware",
            explanation:
              "Middleware không biết handler nào sẽ chạy nên không đọc được `@Public()`. Muốn bỏ qua `/health` phải liệt kê đường dẫn bằng tay, dễ lệch khi đổi route.",
            isCorrect: false,
          },
          {
            id: "in-handler",
            label: "Kiểm tra token ở đầu mỗi handler",
            explanation:
              "Lặp lại 30 lần và cũng dựa vào trí nhớ. Đây chính là cách server action hay làm khi gọi `auth()` ở đầu mỗi hàm.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "tradeoffs",
      kind: "prose",
      title: "Việc nào đặt ở lớp nào",
      body: `Câu hỏi để chọn lớp: **việc này cần biết gì?**

- Chỉ cần request thô (URL, header) → **middleware**.
- Cần biết handler nào sắp chạy và metadata của nó → **guard** (cho qua hay không) hoặc **interceptor** (bọc trước và sau).
- Cần một tham số cụ thể của handler → **pipe**.
- Cần biết lỗi gì đã xảy ra → **exception filter**.

Liên hệ Evonhub: server action gọi \`auth()\` ở đầu từng hàm. Đó là guard viết tay nằm trong handler. Nó chạy được, nhưng quên một chỗ là thủng, và không có chỗ nào gom các quy tắc phân quyền lại. NestJS đẩy việc đó ra một lớp riêng để đặt mặc định an toàn.`,
    },
    {
      id: "explain-back",
      kind: "explain-back",
      title: "Giải thích lại bằng lời của bro",
      prompt:
        "Kể lại hành trình của request `POST /orders` không có token và body sai, qua từng lớp. Rồi giải thích vì sao xác thực nên đặt ở guard, không ở middleware hay trong handler.",
      keyPoints: [
        "Thứ tự: middleware → guard → interceptor (trước) → pipe → handler → interceptor (sau)",
        "Guard trả false thì Nest ném 403, các lớp sau không chạy, exception filter nhận lỗi",
        "Guard biết handler sắp chạy (ExecutionContext + Reflector) nên đọc được @Public, @Roles",
        "Middleware chỉ thấy request thô, không biết handler",
        "Guard toàn cục cho mặc định là đóng, route mở phải ghi rõ",
        "Quyền chỉ lấy từ dữ liệu server đã xác thực, không lấy từ header client gửi",
      ],
    },
  ],
};
