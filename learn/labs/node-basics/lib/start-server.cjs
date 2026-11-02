// Chạy server của bài trong process riêng, như server thật nằm trên máy khác với client.
// Cùng process thì server bị chặn kéo luôn client đứng theo, số đo không còn đúng.
const { fork } = require("node:child_process");
const path = require("node:path");

function startServer(solutionPath) {
  const child = fork(path.join(__dirname, "server-runner.cjs"), [solutionPath], { stdio: "inherit" });

  return new Promise((resolve, reject) => {
    child.once("message", (message) => resolve({ child, port: message.port }));
    child.once("exit", (code) => reject(new Error(`Server dừng trước khi lắng nghe (exit ${code}). Kiểm tra dòng module.exports = server.`)));
  });
}

module.exports = { startServer };
