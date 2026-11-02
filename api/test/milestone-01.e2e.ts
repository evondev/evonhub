import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { sendRequest, startTestServer, type TestServer } from "./http.js";

const ERROR_KEYS = ["message", "path", "requestId", "statusCode"];

function assertErrorBody(body: unknown, statusCode: number, path: string) {
  assert.ok(body && typeof body === "object", `Body lỗi phải là JSON, nhận được: ${JSON.stringify(body)}`);
  assert.deepEqual(Object.keys(body).sort(), ERROR_KEYS, `Body lỗi phải có đúng các key ${ERROR_KEYS.join(", ")}`);
  assert.equal((body as { statusCode: number }).statusCode, statusCode);
  assert.equal((body as { path: string }).path, path);
}

describe("Mốc 1 · Khung API", () => {
  let server: TestServer;

  before(async () => {
    server = await startTestServer();
  });

  after(async () => {
    await server?.app.close();
  });

  it("GET /api/health trả 200 { status: 'ok' }", async () => {
    const response = await sendRequest(server.baseUrl, "/api/health");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { status: "ok" });
  });

  it("Mỗi response có header x-request-id, hai request khác id", async () => {
    const firstResponse = await sendRequest(server.baseUrl, "/api/health");
    const secondResponse = await sendRequest(server.baseUrl, "/api/health");
    const firstId = firstResponse.headers.get("x-request-id");

    assert.ok(firstId, "Thiếu header x-request-id");
    assert.notEqual(firstId, secondResponse.headers.get("x-request-id"));
  });

  it("Client gửi sẵn x-request-id thì giữ nguyên id đó", async () => {
    const response = await sendRequest(server.baseUrl, "/api/health", { "x-request-id": "lb-7f3a" });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-request-id"), "lb-7f3a");
  });

  it("GET /api/courses chỉ trả khoá đã duyệt và chưa xoá", async () => {
    const response = await sendRequest(server.baseUrl, "/api/courses");
    const slugs = Array.isArray(response.body) ? response.body.map((course: { slug: string }) => course.slug) : [];

    assert.equal(response.status, 200);
    assert.deepEqual(slugs, ["nextjs-14-fullstack", "javascript-co-ban"]);
  });

  it("GET /api/courses/:slug trả chi tiết khoá học", async () => {
    const response = await sendRequest(server.baseUrl, "/api/courses/nextjs-14-fullstack");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      slug: "nextjs-14-fullstack",
      title: "Next.js 14 Fullstack: Xây dựng Evonhub",
      price: 1_999_000,
      salePrice: 999_000,
      level: "medium",
      averageRating: 4.8,
      ratingCount: 4,
    });
  });

  it("Slug không có → 404, body { statusCode, message, path, requestId }", async () => {
    const response = await sendRequest(server.baseUrl, "/api/courses/khong-co-khoa-nay");

    assert.equal(response.status, 404);
    assertErrorBody(response.body, 404, "/api/courses/khong-co-khoa-nay");
    assert.equal((response.body as { requestId: string }).requestId, response.headers.get("x-request-id"));
  });

  it("Route không tồn tại → 404 cùng dạng lỗi", async () => {
    const response = await sendRequest(server.baseUrl, "/api/khong-co-route-nay");

    assert.equal(response.status, 404);
    assertErrorBody(response.body, 404, "/api/khong-co-route-nay");
  });

  it("Lỗi bất ngờ trong handler async → 500, không lộ chi tiết lỗi", async () => {
    const response = await sendRequest(server.baseUrl, "/api/courses/html-css-2019");

    assert.equal(response.status, 500);
    assertErrorBody(response.body, 500, "/api/courses/html-css-2019");
    assert.equal((response.body as { message: string }).message, "Internal server error");
  });

  it("Sau lỗi 500, server vẫn trả lời bình thường", async () => {
    await sendRequest(server.baseUrl, "/api/courses/html-css-2019");
    const response = await sendRequest(server.baseUrl, "/api/health");

    assert.equal(response.status, 200);
  });
});
