const { randomUUID } = require("node:crypto");

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
