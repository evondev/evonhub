const http = require("node:http");

// "/courses/:slug" → regex /^\/courses\/([^/]+)$/ và danh sách tên tham số ["slug"].
function compilePath(routePath) {
  const paramNames = [];
  const pattern = routePath.replace(/:(\w+)/g, (_match, paramName) => {
    paramNames.push(paramName);
    return "([^/]+)";
  });

  return { regex: new RegExp(`^${pattern}$`), paramNames };
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
        return response.json(404, { message: `Cannot ${request.method} ${request.path}` });
      }

      if (!layer.matches(request)) return next(error);

      // Có lỗi thì chỉ error handler được chạy. Không lỗi thì bỏ qua error handler.
      if (Boolean(error) !== layer.isErrorHandler) return next(error);

      try {
        const result = error ? layer.handler(error, request, response, next) : layer.handler(request, response, next);

        // Handler async trả về Promise. Promise reject thì chuyển lỗi cho next, như throw đồng bộ.
        if (result instanceof Promise) result.catch(next);
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
