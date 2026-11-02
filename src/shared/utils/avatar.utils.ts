import {
  AVATAR_TONE_CLASS_NAMES,
  CLERK_DEFAULT_AVATAR_PREFIX,
} from "../constants/avatar.constants";

/** User có ảnh thật: không rỗng và không phải ảnh mặc định của Clerk */
export function hasCustomAvatar(avatar?: string): avatar is string {
  return !!avatar && !avatar.startsWith(CLERK_DEFAULT_AVATAR_PREFIX);
}

/** Chữ cái đầu của từ cuối (tên gọi): "Trần Anh Tuấn" → "T" */
export function getAvatarInitial(name: string): string {
  const lastWord = name.trim().split(/\s+/).pop() ?? "";

  return lastWord.charAt(0).toLocaleUpperCase("vi");
}

/** Màu theo tên, cùng tên luôn cùng màu giữa các lần render và các trang */
export function getAvatarToneClassName(name: string): string {
  let hash = 0;

  for (const character of name) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return AVATAR_TONE_CLASS_NAMES[hash % AVATAR_TONE_CLASS_NAMES.length];
}
