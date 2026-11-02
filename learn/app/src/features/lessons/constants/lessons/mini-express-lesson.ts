import type { CodeSnippet, Lesson, StepFlowLane } from "../../types/lesson";

const rawHttpCode: CodeSnippet = {
  fileName: "server.cjs",
  language: "javascript",
  source: `const http = require("node:http");

const server = http.createServer((request, response) => {
  if (request.url === "/courses") {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify([{ slug: "nextjs-14-fullstack" }]));
  }
});

server.listen(3000);
`,
};

const appCode: CodeSnippet = {
  fileName: "app.cjs",
  language: "javascript",
  source: `const { createApp } = require("./mini-express.cjs");
const { requestId } = require("./request-id.cjs");
const { findCourse } = require("./courses.cjs");

const app = createApp();

// App thật ghi log ở đây. Bài này chỉ ghi tên các lớp request đi qua để harness in ra.
app.use((request, response, next) => {
  request.trace = ["logger"];
  next();
});

app.use(requestId);

app.get("/health", (request, response) => {
  response.json(200, { status: "ok", trace: request.trace });
});

app.get("/courses/:slug", async (request, response, next) => {
  request.trace.push("handler");
  const course = await findCourse(request.params.slug);

  if (!course) return next({ statusCode: 404, message: "Không có khoá học" });

  response.json(200, { ...course, trace: request.trace });
});

app.get("/boom", (request) => {
  request.trace.push("handler");
  throw new Error("Lỗi đồng bộ");
});

app.use((request, response) => {
  request.trace.push("notFound");
  response.json(404, { message: "Không có route này", trace: request.trace });
});

// Đủ 4 tham số nên mini-express nhận ra đây là error handler, dù không dùng tới next.
app.use((error, request, response, next) => {
  request.trace.push("errorHandler");
  const statusCode = error.statusCode ?? 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;
  response.json(statusCode, { message, trace: request.trace });
});

module.exports = app.createServer();
`,
};

const miniExpressStarterCode: CodeSnippet = {
  fileName: "mini-express.cjs",
  language: "javascript",
  source: `const http = require("node:http");

// "/courses/:slug" → regex /^\\/courses\\/([^/]+)$/ và danh sách tên tham số ["slug"].
function compilePath(routePath) {
  const paramNames = [];
  const pattern = routePath.replace(/:(\\w+)/g, (_match, paramName) => {
    paramNames.push(paramName);
    return "([^/]+)";
  });

  return { regex: new RegExp(\`^\${pattern}$\`), paramNames };
}

// Mỗi lần gọi app.use / app.get thêm một layer vào stack.
function createLayer(method, routePath, handler) {
  const route = routePath && compilePath(routePath);

  return {
    handler,
    // Giống Express: hàm có 4 tham số (error, request, response, next) là error handler.
    isErrorHandler: handler.length === 4,
    matches(request) {
      if (method && request.method !== method) return false;
      if (!route) return true;

      const match = route.regex.exec(request.path);
      if (!match) return false;

      request.params = Object.fromEntries(route.paramNames.map((name, index) => [name, match[index + 1]]));
      return true;
    },
  };
}

function createApp() {
  const stack = [];

  function handle(request, response) {
    request.path = new URL(request.url, "http://localhost").pathname;
    response.json = (statusCode, body) => {
      response.statusCode = statusCode;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify(body));
    };

    let index = 0;

    function next(error) {
      const layer = stack[index];
      index += 1;

      // Hết stack mà chưa ai trả lời.
      if (!layer) {
        if (error) return response.json(500, { message: "Internal server error" });
        return response.json(404, { message: \`Cannot \${request.method} \${request.path}\` });
      }

      if (!layer.matches(request)) return next(error);

      // TODO 1: có lỗi thì chỉ error handler (layer.isErrorHandler) được chạy.
      //         Không lỗi thì bỏ qua error handler. Bỏ qua bằng cách gọi next(error), như dòng ngay trên.

      try {
        const result = error ? layer.handler(error, request, response, next) : layer.handler(request, response, next);

        // TODO 2: handler async trả về Promise (result). Promise bị reject thì lỗi đi đâu?
      } catch (thrownError) {
        next(thrownError);
      }
    }

    next();
  }

  return {
    use: (handler) => stack.push(createLayer(null, null, handler)),
    get: (routePath, handler) => stack.push(createLayer("GET", routePath, handler)),
    createServer: () => http.createServer(handle),
  };
}

module.exports = { createApp };
`,
};

const requestIdBuggyCode: CodeSnippet = {
  fileName: "request-id.cjs",
  language: "javascript",
  source: `const { randomUUID } = require("node:crypto");

// Load balancer (Nginx, AWS ALB) thường gửi sẵn header x-request-id.
// Dùng lại id đó thì lần theo được một request qua nhiều service.
function requestId(request, response, next) {
  const incomingId = request.headers["x-request-id"];

  if (incomingId) {
    request.id = incomingId;
  } else {
    request.id = randomUUID();
    response.setHeader("x-request-id", request.id);
    next();
  }
}

module.exports = { requestId };
`,
};

const coursesServiceCode: CodeSnippet = {
  fileName: "src/courses.service.ts",
  language: "typescript",
  source: `import { Injectable } from "@nestjs/common";
import { CourseRepository } from "./course.repository.js";
import { logConstructed } from "./construct-log.js";

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepository: CourseRepository) {
    logConstructed("CoursesService", { courseRepository });
  }

  findPublished() {
    return this.courseRepository.findAll().filter((course) => course.status === "approved");
  }
}
`,
};

const appStack = [
  "0 · logger",
  "1 · requestId",
  "2 · GET /health",
  "3 · GET /courses/:slug",
  "4 · GET /boom",
  "5 · notFound",
  "6 · errorHandler",
];

const dispatchLanes: StepFlowLane[] = [
  { id: "stack", title: "stack (theo thứ tự app.use / app.get)" },
  { id: "trace", title: "request.trace" },
  { id: "response", title: "Client nhận" },
];

export const miniExpressLesson: Lesson = {
  slug: "03-mini-express",
  number: 3,
  stage: "Mốc 1 · Dựng khung API",
  title: "Framework làm gì trên module http của Node?",
  summary:
    "Tự viết mini-Express khoảng 80 dòng: router, chuỗi middleware, error handler. Rồi đối chiếu với NestJS: decorator và DI.",
  minutes: 35,
  steps: [
    {
      id: "context",
      kind: "prose",
      title: "Bối cảnh",
      body: `Mốc 1 cần ba thứ cho mọi request: một request id, lỗi trả về đúng một dạng, route lạ thì 404. NestJS làm được cả ba bằng vài decorator. Nhưng bên dưới, Node chỉ đưa cho bro **một hàm** nhận mọi request:

\`\`\`js
http.createServer((request, response) => { ... })
\`\`\`

Không có router, không có middleware, không có error handler. Những thứ đó là việc của framework. Bài này tự viết một framework nhỏ để thấy nó làm gì, rồi đối chiếu với NestJS.

Bro đã dùng những thứ tương tự bên Next.js:

| Next.js | Express / mini-Express | NestJS |
| --- | --- | --- |
| \`app/api/courses/[slug]/route.ts\` | \`app.get("/courses/:slug", handler)\` | \`@Controller("courses")\` + \`@Get(":slug")\` |
| \`proxy.ts\` (trước là \`middleware.ts\`) | \`app.use((req, res, next) => …)\` | class \`NestMiddleware\` |
| \`error.tsx\` | \`app.use((err, req, res, next) => …)\` | \`@Catch()\` exception filter |`,
    },
    {
      id: "predict-raw-404",
      kind: "predict",
      title: "Node thuần không có route",
      intro: "Server viết bằng module `http`, không framework. Nó chỉ xử lý `/courses`.",
      code: rawHttpCode,
      question: {
        prompt: "Gửi `GET /khong-co` tới server này. Client nhận gì?",
        options: [
          {
            id: "hang",
            label: "Không nhận gì cả, request treo tới khi client tự bỏ",
            explanation:
              "Đúng. Response chỉ kết thúc khi có code gọi `response.end()`. Không nhánh nào gọi, và Node mặc định không đặt hạn chờ (`server.timeout` là 0). Chạy thật trên máy bro: client chờ đủ 5 giây rồi tự huỷ, server vẫn im.",
            isCorrect: true,
          },
          {
            id: "auto-404",
            label: "404 Not Found, Node tự trả",
            explanation:
              "Node không biết route nào tồn tại, nên không có khái niệm \"không tìm thấy\". 404 cho route lạ là việc framework làm: Express có một layer cuối stack, Next.js có `not-found.tsx`.",
            isCorrect: false,
          },
          {
            id: "empty-200",
            label: "200 với body rỗng",
            explanation:
              "Status và header chỉ được gửi khi có code gọi `response.end()` hoặc `response.writeHead()`. Ở đây không ai gọi, nên client không nhận được cả dòng status.",
            isCorrect: false,
          },
          {
            id: "crash",
            label: "Server crash vì không có nhánh xử lý",
            explanation:
              "Không có lỗi nào bị ném. Hàm chạy hết và return bình thường. Request chỉ bị bỏ quên: nguy hiểm hơn crash vì không ai thấy.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "model-dispatch",
      kind: "step-flow",
      title: "Theo chân next() qua stack",
      intro:
        "Đây là app dựng bằng mini-Express. Mỗi `app.use` / `app.get` đẩy một **layer** vào mảng `stack`. Theo request `GET /courses/khong-co`: khoá học không tồn tại.",
      code: appCode,
      lanes: dispatchLanes,
      frames: [
        {
          caption:
            "Request tới. `handle()` đặt `index = 0` rồi gọi `next()` lần đầu, không kèm lỗi. Toàn bộ framework chỉ là một biến `index` và hàm `next` đẩy nó đi.",
          lanes: { stack: appStack },
        },
        {
          caption: "`index` 0: layer `logger` không gắn path nên khớp mọi request. Nó chạy rồi gọi `next()`.",
          lanes: { stack: appStack, trace: ["logger"] },
          focusItem: "0 · logger",
          activeLines: [8, 9, 10],
        },
        {
          caption: "`index` 1: `requestId` gắn id cho request, gọi `next()`.",
          lanes: { stack: appStack, trace: ["logger"] },
          focusItem: "1 · requestId",
          activeLines: [13],
        },
        {
          caption:
            "`index` 2: `GET /health` không khớp path. `next` gọi tiếp ngay, handler của layer này **không chạy**. Router chỉ là vòng lặp bỏ qua layer không khớp.",
          lanes: { stack: appStack, trace: ["logger"] },
          focusItem: "2 · GET /health",
          activeLines: [15],
        },
        {
          caption:
            "`index` 3: `GET /courses/:slug` khớp, `request.params.slug` là `\"khong-co\"`. Handler async chạy, `await findCourse(...)` trả `undefined`.",
          lanes: { stack: appStack, trace: ["logger", "handler"] },
          focusItem: "3 · GET /courses/:slug",
          activeLines: [19, 20, 21],
        },
        {
          caption: "Không có khoá, handler gọi `next({ statusCode: 404, ... })`: lần này `next` được gọi **kèm lỗi**.",
          lanes: { stack: appStack, trace: ["logger", "handler"] },
          focusItem: "3 · GET /courses/:slug",
          activeLines: [23],
          question: {
            prompt:
              "Còn lại trong stack: `GET /boom`, `notFound` (khớp mọi path), `errorHandler`. Layer nào xử lý lỗi này?",
            options: [
              {
                id: "error-handler",
                label: "errorHandler, hai layer trước bị bỏ qua",
                explanation:
                  "Đúng. Đang có lỗi thì chỉ layer 4 tham số được chạy. `GET /boom` không khớp path, `notFound` khớp path nhưng là middleware thường.",
                isCorrect: true,
              },
              {
                id: "not-found",
                label: "notFound, vì nó khớp mọi path",
                explanation:
                  "Khớp path là chưa đủ. `notFound` có 2 tham số, là middleware thường. Nếu nó chạy, lỗi 404 \"không có khoá học\" bị đổi thành \"không có route này\": thông tin lỗi mất.",
                isCorrect: false,
              },
              {
                id: "default-500",
                label: "Không layer nào, framework trả 500 mặc định",
                explanation:
                  "Mặc định chỉ dùng khi hết stack mà chưa ai trả lời. Ở đây còn `errorHandler` phía sau.",
                isCorrect: false,
              },
            ],
          },
        },
        {
          caption:
            "`index` 4 và 5: `GET /boom` không khớp path. `notFound` khớp path nhưng đang có lỗi, mà nó không phải error handler: bỏ qua.",
          lanes: { stack: appStack, trace: ["logger", "handler"] },
          focusItem: "5 · notFound",
          activeLines: [33],
        },
        {
          caption:
            "`index` 6: `errorHandler` có đủ 4 tham số `(error, request, response, next)` nên được nhận lỗi. Nó trả 404 với message gốc. Express nhận ra error handler đúng bằng cách này: đếm tham số qua `handler.length`.",
          lanes: {
            stack: appStack,
            trace: ["logger", "handler", "errorHandler"],
            response: ["404 · Không có khoá học"],
          },
          focusItem: "6 · errorHandler",
          activeLines: [39, 40, 41, 42, 43],
        },
      ],
    },
    {
      id: "write-next",
      kind: "code-task",
      taskId: "mini-express-next",
      title: "Viết nốt hàm next()",
      prompt: `Đây là toàn bộ mini-Express. Hàm \`next\` còn thiếu 2 chỗ, đánh dấu \`TODO\`. Harness dựng đúng \`app.cjs\` ở bước trên, gửi 6 request rồi in \`trace\` của từng cái.

**Bấm Chạy trước khi sửa.** Một check sẽ làm process server chết hẳn: đọc stack trace trong output để biết vì sao.`,
      code: miniExpressStarterCode,
      isEditable: true,
      hints: [
        "TODO 1: so `Boolean(error)` với `layer.isErrorHandler`. Hai giá trị khác nhau nghĩa là layer này không dành cho tình huống hiện tại.",
        "TODO 2: handler `async` luôn trả về Promise. Lỗi bên trong không bị `try/catch` bắt, vì nó xảy ra **sau** khi hàm đã return. Gắn `.catch(...)` vào `result` để lỗi đó cũng đi vào `next`.",
        "```js\nif (Boolean(error) !== layer.isErrorHandler) return next(error);\n// ...\nif (result instanceof Promise) result.catch(next);\n```",
      ],
      afterPass:
        "Dòng `.catch(next)` là thứ Express 4 không có: handler async ném lỗi thành unhandled rejection, và từ Node 15 process chết như bro vừa thấy. Express 5 đã thêm (package `router`, file `lib/layer.js`), NestJS thì `await` handler rồi chuyển lỗi cho exception filter. Vì vậy test \"Sau lỗi 500, server vẫn trả lời\" của mốc 1 xanh ngay từ đầu.",
    },
    {
      id: "predict-forgot-next",
      kind: "predict",
      title: "Một nhánh quên next()",
      intro:
        "Middleware gắn request id. Trên máy bro, mở `/health` bằng trình duyệt thì chạy bình thường. Đem deploy sau load balancer (Nginx, AWS ALB). Load balancer **luôn** gắn sẵn header `x-request-id`.",
      code: requestIdBuggyCode,
      question: {
        prompt: "Sau khi deploy, client gọi `/health` qua load balancer thì sao?",
        options: [
          {
            id: "all-hang",
            label: "Mọi request treo, tới khi load balancer hết hạn chờ",
            explanation:
              "Đúng. Nhánh `if` gắn id nhưng không gọi `next()`, và không ai gọi `response.end()`. Trên máy bro không ai gửi header nên luôn đi nhánh `else`. Sau load balancer thì 100% request đi nhánh `if`. Load balancer chờ hết hạn (thường 60 giây) rồi trả 504 cho client.",
            isCorrect: true,
          },
          {
            id: "missing-header",
            label: "Chạy bình thường, chỉ thiếu header x-request-id trong response",
            explanation:
              "Thiếu header là lỗi thật nhưng nhỏ. Lỗi chính là thiếu `next()`: layer tiếp theo không bao giờ chạy, nên handler `/health` không bao giờ trả lời.",
            isCorrect: false,
          },
          {
            id: "auto-next",
            label: "Bình thường: middleware return thì framework tự đi tiếp",
            explanation:
              "Framework không biết middleware đã xong hay đang chờ việc async (đọc DB, gọi API). Gọi `next()` là cách duy nhất để middleware báo \"xong rồi, đi tiếp\". Return mà không gọi thì framework cứ chờ.",
            isCorrect: false,
          },
          {
            id: "error-500",
            label: "Lỗi 500 từ error handler",
            explanation:
              "Không có lỗi nào bị ném nên error handler không chạy. Treo là trạng thái \"chưa xong\", không phải lỗi, nên log lỗi cũng trống trơn. Đó là lý do loại bug này khó tìm.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "fix-request-id",
      kind: "code-task",
      taskId: "mini-express-hang",
      title: "Sửa middleware request id",
      prompt:
        "Bấm Chạy trước khi sửa: request kèm header treo đủ 2 giây tới khi harness bỏ cuộc. Rồi sửa để nhánh nào cũng gắn header vào response và gọi `next()` **đúng một lần**.",
      code: requestIdBuggyCode,
      isEditable: true,
      hints: [
        "Hai nhánh chỉ khác nhau ở chỗ id lấy từ đâu. Phần còn lại (gắn header, gọi `next()`) đưa ra ngoài `if/else`.",
        "`??` lấy vế phải khi vế trái là `undefined` hoặc `null`: `request.headers[\"x-request-id\"] ?? randomUUID()`.",
        "```js\nrequest.id = request.headers[\"x-request-id\"] ?? randomUUID();\nresponse.setHeader(\"x-request-id\", request.id);\nnext();\n```",
      ],
      afterPass:
        "Đây chính là TODO đầu tiên của mốc 1 (`RequestIdMiddleware`), chỉ khác cú pháp Nest. Nhớ quy tắc: mọi nhánh của middleware phải hoặc trả response, hoặc gọi `next()`, đúng một trong hai, đúng một lần. Thiếu thì treo. Gọi `next()` rồi còn tự trả response thì hai nơi cùng trả lời, Node báo `ERR_HTTP_HEADERS_SENT`.",
    },
    {
      id: "nest-mapping",
      kind: "prose",
      title: "NestJS đứng ở đâu",
      body: `NestJS (bản \`platform-express\`) chạy **trên** Express. Mỗi thứ bro vừa viết tay có một chỗ tương ứng:

| mini-Express | NestJS | Khác gì |
| --- | --- | --- |
| \`app.use(requestId)\` | \`consumer.apply(RequestIdMiddleware).forRoutes(...)\` | Gần như giữ nguyên: Nest middleware chính là Express middleware |
| \`app.get("/courses/:slug", fn)\` | \`@Controller("courses")\` + \`@Get(":slug")\` | Khai bằng decorator. Lúc khởi động Nest đọc metadata rồi tự đăng ký route vào Express |
| \`result.catch(next)\` | Nest \`await\` handler | Lỗi async không làm chết process |
| error handler 4 tham số | \`@Catch()\` exception filter | Filter nhận lỗi đã có kiểu, không phải đếm tham số |
| \`const service = new CoursesService(new CourseRepository())\` | \`constructor(private coursesService: CoursesService)\` | **Ai gọi \`new\`?** Phần tiếp theo |

Hàng cuối là thứ Express không có. Trong Express bro tự \`new\` mọi thứ rồi truyền tay. Trong Nest bro chỉ khai trong constructor là cần gì, Nest tự tạo và truyền vào. Đó là **dependency injection** (DI).`,
    },
    {
      id: "predict-injectable",
      kind: "predict",
      title: "Nest biết truyền gì vào constructor nhờ đâu?",
      intro:
        "`CoursesService` cần `CourseRepository`. Cả hai được khai trong `providers` của module. Lúc khởi động, Nest phải biết constructor này cần class nào.",
      code: coursesServiceCode,
      question: {
        prompt: "Xoá dòng `@Injectable()` khỏi `CoursesService`, giữ nguyên mọi thứ khác. Chuyện gì xảy ra?",
        options: [
          {
            id: "silent-undefined",
            label: "App vẫn khởi động, nhưng courseRepository là undefined: request gọi tới thì 500",
            explanation:
              "Đúng, và đây là chỗ đáng sợ. TypeScript chỉ ghi lại kiểu tham số constructor (`design:paramtypes`) cho class **có decorator**. Mất `@Injectable()` thì không còn metadata, Nest tưởng constructor không cần gì, gọi `new CoursesService()` trống. Không có lỗi lúc khởi động, lỗi chỉ lộ ra khi có request.",
            isCorrect: true,
          },
          {
            id: "startup-error",
            label: "Nest báo lỗi lúc khởi động: không resolve được dependency",
            explanation:
              "Nhiều người nghĩ vậy vì Nest có thông báo \"Nest can't resolve dependencies…\". Nhưng thông báo đó chỉ hiện khi Nest **biết** constructor cần gì mà không tìm được provider. Ở đây Nest không biết gì để mà báo. Bước sau chạy thật cho bro thấy.",
            isCorrect: false,
          },
          {
            id: "by-name",
            label: "Không sao: Nest đọc tên tham số courseRepository để tìm provider",
            explanation:
              "Nest không dựa vào tên tham số. Sau khi biên dịch hay minify, tên có thể đổi. Nest dựa vào **kiểu** mà TypeScript ghi lại, và chỉ có khi class có decorator.",
            isCorrect: false,
          },
          {
            id: "compile-error",
            label: "TypeScript báo lỗi biên dịch",
            explanation:
              "Với TypeScript, class không decorator vẫn hợp lệ hoàn toàn. Biên dịch qua, chỉ lúc chạy mới hỏng.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "observe-di",
      kind: "code-task",
      taskId: "nest-di",
      title: "Xem DI chạy thật",
      prompt: `Harness in metadata TypeScript ghi cho từng class, để Nest dựng app (mỗi constructor in ra nó nhận được gì), rồi gửi 3 request \`GET /courses\`.

1. Bấm Chạy, đọc output.
2. Xoá dòng \`@Injectable()\`, chạy lại. So hai lần: dòng \`design:paramtypes\`, **thứ tự** các dòng \`new\`, và status của 3 request.`,
      code: coursesServiceCode,
      isEditable: true,
      hints: [],
      afterPass:
        "Để ý lần có `@Injectable()`: `CourseRepository` được `new` trước, rồi mới tới `CoursesService`. Nest đọc metadata, thấy service cần repository nên tạo repository trước. Mỗi class chỉ bị `new` **một lần** dù có 3 request: provider mặc định là singleton, sống suốt đời app. Mất metadata thì Nest không biết thứ tự, `new CoursesService` chạy trước, nhận `undefined`.",
    },
    {
      id: "explain-back",
      kind: "explain-back",
      title: "Giải thích lại bằng lời của bro",
      prompt:
        "Một request đi qua mini-Express thế nào, từ `handle()` tới lúc client nhận response? Khi handler gọi `next(lỗi)` hoặc handler async ném lỗi thì sao? Rồi giải thích Nest biết truyền gì vào constructor nhờ đâu.",
      keyPoints: [
        "Framework giữ một stack layer theo thứ tự app.use / app.get, và một index cho mỗi request",
        "next() đẩy index đi: layer không khớp path hay method thì bỏ qua",
        "Có lỗi thì chỉ error handler (4 tham số) chạy, middleware thường bị bỏ qua",
        "Handler async trả Promise: phải .catch(next), không thì unhandled rejection làm chết process",
        "Middleware quên next() thì request treo, không có lỗi nào được log",
        "TypeScript ghi design:paramtypes cho class có decorator, Nest đọc nó để biết cần new gì trước",
        "Thiếu @Injectable thì không có lỗi lúc khởi động, dependency là undefined",
      ],
    },
  ],
};
