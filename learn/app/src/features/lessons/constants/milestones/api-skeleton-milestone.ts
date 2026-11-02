import type { Milestone } from "../../types/milestone";
import { toLessonLink } from "../../utils/lesson-link";
import { miniExpressLesson } from "../lessons/mini-express-lesson";

export const apiSkeletonMilestone: Milestone = {
  slug: "m01-api-skeleton",
  number: 1,
  stage: "Chặng 1 · Nền và dữ liệu",
  title: "Dựng khung API",
  feature: "API khoá học",
  problem: "framework làm gì trên module http của Node",
  summary:
    "Khung NestJS mà mọi mốc sau dựa vào: route khoá học, request id cho mọi request, mọi lỗi trả về cùng một dạng.",
  minutes: 60,
  steps: [
    {
      id: "brief",
      kind: "prose",
      title: "Đề bài",
      body: `Evonhub hiện là Next.js: server action vừa là API vừa nằm chung với UI. \`evonhub-api\` tách backend thành một API riêng bằng NestJS. Mốc 1 dựng cái khung, chưa có database:

| Endpoint | Trả về |
| --- | --- |
| \`GET /api/health\` | \`200 { status: "ok" }\` |
| \`GET /api/courses\` | Các khoá đã duyệt và chưa xoá |
| \`GET /api/courses/:slug\` | Chi tiết một khoá. Khoá đã lưu trữ vẫn xem được (người đã mua cần vào học) |

Ba quy tắc cho **mọi** request:

- **Có request id.** Response có header \`x-request-id\`. Load balancer gửi sẵn id thì dùng lại, không thì tự tạo. Log lỗi ghi kèm id để lần ra đúng request.
- **Mọi lỗi cùng một dạng:** \`{ statusCode, message, path, requestId }\`. Client chỉ cần một đoạn code xử lý lỗi.
- **Lỗi bất ngờ không lộ ra ngoài:** trả 500 với message \`"Internal server error"\`. Chi tiết chỉ nằm trong log server.

Dữ liệu chép từ MongoDB của Evonhub (\`src/courses/courses.seed.ts\`). Một bản ghi cũ thiếu field \`rating\`, sẽ gây chuyện.

\`\`\`
api/
├── src/
│   ├── main.ts                        chạy server ở cổng 4000
│   ├── app.factory.ts                 dựng app: prefix /api, filter toàn cục
│   ├── app.module.ts                  gắn middleware cho mọi route
│   ├── common/
│   │   ├── request-id.middleware.ts   ← bro viết
│   │   └── http-error.filter.ts       ← bro viết
│   ├── health/health.controller.ts
│   └── courses/
│       ├── courses.controller.ts      ← bro viết
│       ├── courses.service.ts
│       └── courses.seed.ts
└── test/milestone-01.e2e.ts           9 test chấp nhận
\`\`\`

Chạy tay trong terminal: \`cd api && npm start\`, rồi \`curl -i http://127.0.0.1:4000/api/courses\`.`,
    },
    {
      id: "predict-request-id-layer",
      kind: "predict",
      title: "Dự đoán thiết kế: request id đặt ở lớp nào",
      question: {
        prompt:
          "Bài 2 có 5 lớp: middleware, guard, interceptor, pipe, exception filter. Việc \"gắn request id cho mọi response\" đặt ở lớp nào?",
        options: [
          {
            id: "middleware",
            label: "Middleware",
            explanation:
              "Đúng. Middleware chạy cho mọi request khớp path, kể cả route không tồn tại. Chạy thật trên evonhub-api: `GET /api/khong-co` vẫn có header `x-request-id`. Nó cũng chạy đầu tiên, nên mọi lớp sau (guard, filter, log lỗi) đều đọc được id.",
            isCorrect: true,
          },
          {
            id: "interceptor",
            label: "Interceptor toàn cục",
            explanation:
              "Interceptor chỉ chạy khi Nest đã tìm được handler. Chạy thật với một interceptor toàn cục: `GET /api/khong-co` trả 404 mà interceptor không chạy lần nào. Response 404 sẽ thiếu id, đúng lúc cần id nhất.",
            isCorrect: false,
          },
          {
            id: "guard",
            label: "Guard toàn cục",
            explanation:
              "Guard trả lời câu \"cho qua hay chặn\". Gắn id không phải việc đó. Guard cũng chỉ chạy khi đã có handler, nên route lạ vẫn thiếu id.",
            isCorrect: false,
          },
          {
            id: "handler",
            label: "Trong từng handler",
            explanation:
              "Mỗi controller viết lại một lần, quên một chỗ là log thiếu id. Route không tồn tại thì không có handler nào để viết.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "predict-default-error",
      kind: "predict",
      title: "Dự đoán thiết kế: chưa có filter thì sao",
      intro:
        "Bản ghi `html-css-2019` thiếu `rating`, nên `toCourseSummary` ném `TypeError` bên trong handler async của `GET /api/courses/html-css-2019`.",
      question: {
        prompt: "Giả sử **chưa** viết exception filter nào. Client nhận gì?",
        options: [
          {
            id: "default-500",
            label: "500 { statusCode: 500, message: \"Internal server error\" }",
            explanation:
              "Đúng, chạy thật ra đúng body này. Nest có sẵn filter mặc định: lỗi không phải `HttpException` thành 500, chi tiết chỉ ghi log. Vậy sao còn tự viết filter? Body mặc định không có `path`, `requestId`, còn 404 thì lại có thêm field `error: \"Not Found\"`. Hai dạng khác nhau, và log không có id để tìm.",
            isCorrect: true,
          },
          {
            id: "crash",
            label: "Process server chết",
            explanation:
              "Đó là Express 4 với handler async, bài 3 cho bro thấy tận mắt. Nest `await` handler nên lỗi được bắt và đưa cho filter.",
            isCorrect: false,
          },
          {
            id: "leak",
            label: "500 kèm message \"Cannot read properties of undefined (reading 'reduce')\"",
            explanation:
              "Filter mặc định giấu message của lỗi lạ. Lộ chi tiết xảy ra khi tự viết filter mà trả thẳng `exception.message` cho mọi lỗi. Một test của mốc này bắt đúng lỗi đó.",
            isCorrect: false,
          },
          {
            id: "hang",
            label: "Request treo",
            explanation: "Treo là khi không ai trả response. Ở đây Nest bắt được lỗi và trả 500.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "lab-mini-express",
      kind: "lab-link",
      title: "Bên dưới @Controller có gì",
      prompt:
        "Trước khi viết: framework làm gì bên dưới `@Controller` và `NestMiddleware`? Bài 3 cho bro tự viết mini-Express, sửa đúng con bug `next()` mà TODO đầu tiên dễ dính, và xem DI chạy thật. Muốn làm trước cũng được, vấp thì quay lại đây.",
      lesson: toLessonLink(miniExpressLesson),
    },
    {
      id: "acceptance",
      kind: "acceptance",
      title: "Viết code, chạy test chấp nhận",
      suiteId: "milestone-01",
      prompt: `Mở 3 file dưới trong VS Code, viết vào chỗ \`TODO (mốc 1)\`, lưu, rồi bấm chạy test. Chạy bất cứ lúc nào cũng được: code gốc xanh 2/9, vì health và "server vẫn sống" Nest lo sẵn.

Trong terminal: \`cd api && npm test\`.`,
      todoFiles: [
        {
          path: "src/common/request-id.middleware.ts",
          line: 10,
          task: "Lấy id từ header `x-request-id`, không có thì tạo bằng `randomUUID()`. Gắn vào `request.requestId` và header của response. Bài 3 đã sửa y hệt.",
        },
        {
          path: "src/common/http-error.filter.ts",
          line: 19,
          task: "Mọi lỗi thành `{ statusCode, message, path, requestId }`. Lỗi lạ thì 500 và `\"Internal server error\"`, chi tiết chỉ `console.error`.",
        },
        {
          path: "src/courses/courses.controller.ts",
          line: 6,
          task: "Nhận `CoursesService` qua constructor. `findAll` trả danh sách, `findOne` không thấy khoá thì ném `NotFoundException`.",
        },
      ],
      hints: [
        "Middleware: `request.header(\"x-request-id\")` của Express trả `string | undefined`, ghép với `?? randomUUID()`.",
        "Filter: `exception instanceof HttpException` tách hai loại lỗi. Body phải có **đúng** 4 key. Nếu `requestId` là `undefined` thì `JSON.stringify` bỏ luôn key đó, nên middleware phải xong trước thì test lỗi mới xanh.",
        "Controller: `constructor(private readonly coursesService: CoursesService) {}`, rồi `this.coursesService.findPublished()`. `findBySlug` là hàm async.",
      ],
      afterPass:
        "Mở `src/courses/courses.seed.ts` xem bản ghi `html-css-2019`. TypeScript nói `rating: number[]`, dữ liệu thật thì không có: kiểu chỉ là lời hứa lúc biên dịch, lúc chạy không ai kiểm. Mốc 2 chuyển sang MySQL, cột `NOT NULL` chặn chuyện này ngay lúc ghi.",
    },
    {
      id: "break-forgot-next",
      kind: "predict",
      title: "Phá thử: quên next()",
      intro:
        "Test đã xanh. Giờ comment dòng `next()` trong `RequestIdMiddleware` rồi chạy lại test. **Đoán trước khi chạy.**",
      question: {
        prompt: "Kết quả bộ test thế nào?",
        options: [
          {
            id: "all-timeout",
            label: "0/9: mọi test trượt vì không có response, cả bộ mất hơn 20 giây",
            explanation:
              "Đúng. Chạy thật: 9 test cùng trượt với dòng \"không có response sau 2 giây\", cả bộ mất khoảng 20 giây. Middleware gắn cho mọi route (`forRoutes(\"{*path}\")`) nên request nào cũng kẹt ở đó, kể cả health và 404. Chạy thử cho thấy tận mắt, rồi nhớ bỏ comment.",
            isCorrect: true,
          },
          {
            id: "header-only",
            label: "Chỉ 2 test về x-request-id trượt",
            explanation:
              "Thiếu `next()` không chỉ làm mất header: request không bao giờ tới được controller hay filter.",
            isCorrect: false,
          },
          {
            id: "nest-detects",
            label: "Nest phát hiện và báo lỗi middleware không gọi next",
            explanation:
              "Nest không phân biệt được middleware đang chờ việc async hay đã quên. Không lỗi, không log, chỉ treo. Bài 3 đã thấy y hệt ở mini-Express.",
            isCorrect: false,
          },
          {
            id: "not-found-green",
            label: "Test route lạ vẫn xanh vì route lạ không đi qua middleware",
            explanation:
              "Route lạ vẫn đi qua middleware. Chính vì vậy request id mới đặt ở middleware, như câu dự đoán đầu mốc.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "break-forgot-await",
      kind: "predict",
      title: "Phá thử: quên await",
      intro:
        "Bỏ comment `next()`. Giờ xoá chữ `await` trước `this.coursesService.findBySlug(slug)` trong `findOne`, chạy lại test. **Đoán trước khi chạy.**",
      question: {
        prompt: "Bao nhiêu test xanh?",
        options: [
          {
            id: "only-404-fails",
            label: "8/9: chỉ test slug không có trượt, server trả 200 body rỗng",
            explanation:
              "Đúng, chạy thật ra đúng vậy. Không `await` thì `course` là một Promise, luôn truthy, nên `if (!course)` không bao giờ đúng. Handler trả Promise đó về, Nest `await` nó: khoá có thật vẫn ra đúng dữ liệu, lỗi bất ngờ vẫn thành 500. Chỉ khoá không tồn tại thì Promise ra `undefined`, Nest gửi 200 body rỗng. Thiếu test cho ca \"không tìm thấy\" thì bug này lọt lên production.",
            isCorrect: true,
          },
          {
            id: "compile-error",
            label: "TypeScript báo lỗi, không build được",
            explanation: "Chạy thật: biên dịch qua, không cảnh báo gì. `!course` với `course` là Promise vẫn hợp lệ.",
            isCorrect: false,
          },
          {
            id: "all-course-routes",
            label: "Mọi test về khoá học đều trượt",
            explanation:
              "Nest `await` giá trị handler trả về, kể cả khi đó là Promise. Khoá có thật vẫn ra đúng dữ liệu.",
            isCorrect: false,
          },
          {
            id: "error-escapes",
            label: "Test lỗi bất ngờ trượt vì lỗi không được bắt",
            explanation:
              "Promise bị reject được trả thẳng cho Nest. Nest `await` nó và chuyển lỗi cho filter như thường.",
            isCorrect: false,
          },
        ],
      },
    },
    {
      id: "explain-back",
      kind: "explain-back",
      title: "Giải thích lại bằng lời của bro",
      prompt:
        "Kể lại request `GET /api/courses/khong-co` đi qua evonhub-api: lớp nào chạy, theo thứ tự nào, ai tạo `CoursesService`, body lỗi được dựng ở đâu. Rồi trả lời: vì sao test dựng app bằng `createApp()` chứ không tự gọi `NestFactory.create`?",
      keyPoints: [
        "RequestIdMiddleware chạy trước tiên, gắn id cho cả route không tồn tại",
        "Nest tìm handler qua @Controller + @Get, đọc :slug bằng @Param",
        "CoursesService do Nest tạo một lần lúc khởi động, truyền qua constructor nhờ @Injectable và metadata",
        "Không thấy khoá thì ném NotFoundException, HttpErrorFilter dựng body { statusCode, message, path, requestId }",
        "Lỗi lạ thành 500 với message chung, chi tiết chỉ ở log server kèm request id",
        "Test và main.ts dùng chung createApp, nên test chạy đúng app thật: có prefix /api và filter",
      ],
    },
  ],
};
