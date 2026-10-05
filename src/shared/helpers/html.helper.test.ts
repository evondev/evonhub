import { describe, expect, it } from "vitest";
import { escapeHtml, sanitizeHtml } from "./html.helper";

describe("sanitizeHtml", () => {
  it("giữ định dạng của nội dung bài", () => {
    const lessonHtml =
      '<p>Xem <a href="https://evonhub.dev">link</a></p><pre><code class="language-js">const a = 1;</code></pre><img src="https://utfs.io/f/a.png" alt="ảnh">';

    expect(sanitizeHtml(lessonHtml)).toBe(lessonHtml);
  });

  it("bỏ script, thuộc tính sự kiện và link javascript:", () => {
    const sanitizedHtml = sanitizeHtml(
      '<p onclick="alert(1)">Chữ</p><script>alert(2)</script><img src=x onerror="alert(3)"><a href="javascript:alert(4)">bấm</a>',
    );

    expect(sanitizedHtml).not.toMatch(/script|onclick|onerror|javascript:/i);
    expect(sanitizedHtml).toContain("Chữ");
  });
});

describe("escapeHtml", () => {
  it("biến thẻ thành chữ", () => {
    expect(escapeHtml('<b>"Tên"</b>')).toBe(
      "&lt;b&gt;&quot;Tên&quot;&lt;/b&gt;",
    );
  });
});
