import type { INestApplication } from "@nestjs/common";
import { createApp } from "../src/app.factory.js";

const RESPONSE_TIMEOUT_MS = 2000;

export interface TestServer {
  app: INestApplication;
  baseUrl: string;
}

export interface TestResponse {
  status: number;
  headers: Headers;
  body: unknown;
}

// Dựng đúng app như main.ts, lắng nghe ở cổng ngẫu nhiên để test chạy song song không đụng nhau.
export async function startTestServer(): Promise<TestServer> {
  const app = await createApp();
  await app.listen(0, "127.0.0.1");
  const baseUrl = (await app.getUrl()).replace("[::1]", "127.0.0.1");

  return { app, baseUrl };
}

export async function sendRequest(baseUrl: string, path: string, headers: Record<string, string> = {}) {
  let response: Response;

  try {
    response = await fetch(baseUrl + path, { headers, signal: AbortSignal.timeout(RESPONSE_TIMEOUT_MS) });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error(`${path}: không có response sau ${RESPONSE_TIMEOUT_MS / 1000} giây. Có lớp nào quên gọi next()?`);
    }

    throw error;
  }

  const text = await response.text();
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const testResponse: TestResponse = { status: response.status, headers: response.headers, body: isJson ? JSON.parse(text) : text };

  return testResponse;
}
