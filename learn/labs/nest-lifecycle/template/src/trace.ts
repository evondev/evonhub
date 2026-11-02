// Mỗi lớp ghi tên mình vào đây khi chạy, harness đọc ra thứ tự thật của một request.
export const traceSteps: string[] = [];

export function record(step: string) {
  traceSteps.push(step);
}

export function resetTrace() {
  traceSteps.length = 0;
}
