import type { EmbedVideo } from "@/shared/types";
import { extractDriveId } from "./index";

// watch?v=, youtu.be/, embed/, shorts/, live/; id YouTube luôn 11 ký tự
const youtubeIdPatterns: RegExp[] = [
  /youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
];

/** Lấy src nếu người dùng dán cả mã <iframe>, không thì giữ nguyên */
function getIframeSource(input: string): string {
  const sourceMatch = input.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);

  return sourceMatch?.[1] || input;
}

/** Id video từ link YouTube các dạng, rỗng khi không phải link YouTube */
export function getYoutubeVideoId(input: string): string {
  const source = getIframeSource(input.trim());

  for (const pattern of youtubeIdPatterns) {
    const idMatch = source.match(pattern);

    if (idMatch) return idMatch[1];
  }

  return "";
}

/** Ảnh thumbnail YouTube của link (480x360), rỗng khi không phải link YouTube */
export function getYoutubeThumbnail(input: string): string {
  const youtubeId = getYoutubeVideoId(input);

  return youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "";
}

/**
 * Ô "Link YouTube / Google Drive" của bài học: nhận link hoặc mã iframe.
 * Không phải YouTube thì hiểu là Google Drive như trước đây, kể cả khi chỉ dán id
 */
export function parseEmbedVideo(input?: string): EmbedVideo | null {
  const trimmedInput = input?.trim() || "";

  if (!trimmedInput) return null;

  const youtubeId = getYoutubeVideoId(trimmedInput);

  if (youtubeId) return { provider: "youtube", id: youtubeId };

  const driveId = extractDriveId(getIframeSource(trimmedInput));

  if (driveId) return { provider: "drive", id: driveId };

  return null;
}

/** Ô trống cũng hợp lệ: bài dùng video Mux hoặc chưa có video */
export function isValidEmbedVideoInput(input: string): boolean {
  return !input.trim() || Boolean(parseEmbedVideo(input));
}
