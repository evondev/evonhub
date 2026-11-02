// Harness của bài: dựng app, bắn vài request, in thứ tự các lớp đã chạy rồi chấm.
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { resetTrace, traceSteps } from "./trace.js";

interface LabRequest {
  label: string;
  token?: string;
  body: Record<string, unknown>;
}

interface LabCheck {
  label: string;
  isPassed: boolean;
  detail?: string;
}

const validBody = { courseId: "nestjs-co-ban", amount: 499000 };
const invalidBody = { courseId: "nestjs-co-ban", amount: -5 };

async function sendOrder(baseUrl: string, labRequest: LabRequest) {
  resetTrace();

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (labRequest.token) headers.authorization = `Bearer ${labRequest.token}`;

  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(labRequest.body),
  });
  await response.text();
  const steps = [...traceSteps];

  console.log(`▶ ${labRequest.label} → ${response.status}`);
  console.log(`  ${steps.join(" → ")}`);

  return { status: response.status, steps };
}

function reportChecks(checks: LabCheck[]) {
  console.log("__RESULT__" + JSON.stringify({ checks }));
}

const app = await NestFactory.create(AppModule, { logger: false });
await app.listen(0, "127.0.0.1");
const baseUrl = (await app.getUrl()).replace("[::1]", "127.0.0.1");

const withTokenValid = await sendOrder(baseUrl, { label: "Có token, body đúng", token: "lab-token", body: validBody });
const noTokenInvalid = await sendOrder(baseUrl, { label: "Không token, body sai", body: invalidBody });
const withTokenInvalid = await sendOrder(baseUrl, { label: "Có token, body sai", token: "lab-token", body: invalidBody });
const wrongToken = await sendOrder(baseUrl, { label: "Sai token, body đúng", token: "abc", body: validBody });

await app.close();

if (process.env.LAB_TASK === "nest-observe") {
  reportChecks([{ label: "Đã chạy xong, xem thứ tự các lớp ở trên", isPassed: true }]);
} else {
  reportChecks([
    { label: "Có token đúng, body đúng → 201", isPassed: withTokenValid.status === 201, detail: `Nhận ${withTokenValid.status}` },
    { label: "Sai token → 403", isPassed: wrongToken.status === 403, detail: `Nhận ${wrongToken.status}` },
    {
      label: "Không token, body sai → 403 (guard chặn trước khi pipe kịp chạy)",
      isPassed: noTokenInvalid.status === 403 && !noTokenInvalid.steps.includes("pipe"),
      detail: `Nhận ${noTokenInvalid.status}`,
    },
    { label: "Có token, body sai → 400 từ pipe", isPassed: withTokenInvalid.status === 400, detail: `Nhận ${withTokenInvalid.status}` },
  ]);
}
