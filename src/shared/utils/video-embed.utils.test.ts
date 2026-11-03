import { describe, expect, it } from "vitest";
import {
  getYoutubeVideoId,
  isValidEmbedVideoInput,
  parseEmbedVideo,
} from "./video-embed.utils";

describe("getYoutubeVideoId", () => {
  it("nhận các dạng link YouTube hay gặp", () => {
    expect(
      getYoutubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
    expect(
      getYoutubeVideoId(
        "https://www.youtube.com/watch?list=PL1&v=dQw4w9WgXcQ&t=42s",
      ),
    ).toBe("dQw4w9WgXcQ");
    expect(getYoutubeVideoId("https://youtu.be/dQw4w9WgXcQ?si=abc")).toBe(
      "dQw4w9WgXcQ",
    );
    expect(
      getYoutubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
    expect(getYoutubeVideoId("https://www.youtube.com/live/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
    expect(getYoutubeVideoId("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
  });

  it("nhận cả mã iframe nhúng", () => {
    expect(
      getYoutubeVideoId(
        '<iframe width="560" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=10" allowfullscreen></iframe>',
      ),
    ).toBe("dQw4w9WgXcQ");
  });

  it("không phải YouTube thì rỗng", () => {
    expect(getYoutubeVideoId("https://drive.google.com/file/d/1AbC/view")).toBe(
      "",
    );
    expect(getYoutubeVideoId("https://vimeo.com/123456")).toBe("");
  });
});

describe("parseEmbedVideo", () => {
  it("ô trống là không có video nhúng", () => {
    expect(parseEmbedVideo("")).toBeNull();
    expect(parseEmbedVideo("   ")).toBeNull();
    expect(parseEmbedVideo(undefined)).toBeNull();
  });

  it("link YouTube thành video YouTube", () => {
    expect(parseEmbedVideo(" https://youtu.be/dQw4w9WgXcQ ")).toEqual({
      provider: "youtube",
      id: "dQw4w9WgXcQ",
    });
  });

  it("giữ cách đọc Google Drive cũ: link, mã iframe, id trần", () => {
    const drive = { provider: "drive", id: "1AbC-xyz_9" };

    expect(
      parseEmbedVideo(
        "https://drive.google.com/file/d/1AbC-xyz_9/view?usp=sharing",
      ),
    ).toEqual(drive);
    expect(
      parseEmbedVideo(
        '<iframe src="https://drive.google.com/file/d/1AbC-xyz_9/preview"></iframe>',
      ),
    ).toEqual(drive);
    expect(
      parseEmbedVideo("https://drive.google.com/open?id=1AbC-xyz_9"),
    ).toEqual(drive);
    expect(parseEmbedVideo("1AbC-xyz_9")).toEqual(drive);
  });

  it("link không đọc được thì null", () => {
    expect(parseEmbedVideo("https://vimeo.com/123456")).toBeNull();
  });
});

describe("isValidEmbedVideoInput", () => {
  it("ô trống hợp lệ, link lạ không hợp lệ", () => {
    expect(isValidEmbedVideoInput("")).toBe(true);
    expect(isValidEmbedVideoInput("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
    expect(isValidEmbedVideoInput("https://vimeo.com/123456")).toBe(false);
  });
});
