import { describe, expect, it } from "vitest";
import { escapeHtml, htmlToPlainText, sanitizeHtml } from "./html.helper";

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

describe("htmlToPlainText", () => {
  it("bỏ thẻ, đoạn liền nhau cách bằng một khoảng trắng", () => {
    expect(htmlToPlainText("<p>Một</p><p><strong>Hai</strong>\n ba</p>")).toBe(
      "Một Hai ba",
    );
  });

  it("giải mã entity TinyMCE lưu kèm", () => {
    expect(
      htmlToPlainText("<p>Trong kh&oacute;a học n&agrave;y&nbsp;m&igrave;nh</p>"),
    ).toBe("Trong khóa học này mình");
  });

  it("giữ ký tự đặc biệt người viết gõ ra, không giải mã hai lần", () => {
    expect(htmlToPlainText("<p>a &lt; b &amp;&amp; &amp;lt;tag&amp;gt;</p>")).toBe(
      "a < b && &lt;tag&gt;",
    );
  });
});
