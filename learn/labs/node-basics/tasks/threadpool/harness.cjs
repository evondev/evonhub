const { fork } = require("node:child_process");
const path = require("node:path");
const { report } = require("../../lib/report.cjs");

const child = fork(path.join(__dirname, "solution.cjs"), { stdio: "inherit" });

child.on("exit", (exitCode) => {
  report([{ label: "Đã chạy xong, xem các mốc thời gian ở trên", isPassed: exitCode === 0 }]);
});
