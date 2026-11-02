const { createApp } = require("./mini-express.cjs");
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
