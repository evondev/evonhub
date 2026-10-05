import {
  PREVIEW_TAKEN_USERNAME,
  PROFILE_RESERVED_USERNAME_PARTS,
  PROFILE_RESERVED_USERNAMES,
  PROFILE_USERNAME_RESERVED_MESSAGE,
  PROFILE_USERNAME_TAKEN_MESSAGE,
} from "../constants";
import {
  ProfileAvatarTone,
  ProfilePublicFormValues,
  ProfileSaveResult,
} from "../types";

const profileAvatarTones: ProfileAvatarTone[] = [
  {
    background: "bg-emerald-50 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  {
    background: "bg-sky-50 dark:bg-sky-500/15",
    text: "text-sky-700 dark:text-sky-300",
  },
  {
    background: "bg-indigo-50 dark:bg-indigo-500/15",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  {
    background: "bg-pink-50 dark:bg-pink-500/15",
    text: "text-pink-700 dark:text-pink-300",
  },
  {
    background: "bg-amber-50 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-orange-400",
  },
  {
    background: "bg-violet-50 dark:bg-violet-500/15",
    text: "text-violet-700 dark:text-violet-300",
  },
];

/** Cùng một người luôn ra cùng một màu: seed là username hoặc email, không phải tên */
export function getProfileAvatarTone(seed: string): ProfileAvatarTone {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  return profileAvatarTones[Math.abs(hash) % profileAvatarTones.length];
}

/** "Trần Minh Khoa" -> "T" */
export function getProfileInitial(name: string): string {
  return name.trim().charAt(0).toLocaleUpperCase("vi") || "?";
}

export function buildPublicProfilePath(basePath: string, username: string) {
  return `${basePath}/${username.trim()}`;
}

/** Trang xem trước không ghi gì: chờ một nhịp để thấy nút đang lưu */
export function simulatePreviewSave(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

/** "Evon.Dev_Official" -> "evondevofficial": so tên dành riêng không bị lách bằng hoa thường, dấu chấm */
function normalizeUsername(username: string): string {
  return username.toLowerCase().replace(/[._-]/g, "");
}

/** Username giả danh đội ngũ: chứa evondev, evonhub hoặc trùng tên như admin, support */
export function isReservedUsername(username: string): boolean {
  const normalizedUsername = normalizeUsername(username);

  if (PROFILE_RESERVED_USERNAMES.includes(normalizedUsername)) return true;

  return PROFILE_RESERVED_USERNAME_PARTS.some((reservedPart) =>
    normalizedUsername.includes(reservedPart),
  );
}

/** Lưu khối Hồ sơ công khai ở trang xem trước: chặn tên dành riêng và PREVIEW_TAKEN_USERNAME như server */
export async function simulatePreviewPublicSave(
  values: ProfilePublicFormValues,
  delayMs: number,
): Promise<ProfileSaveResult> {
  await simulatePreviewSave(delayMs);

  if (isReservedUsername(values.username)) {
    return {
      isSuccess: false,
      fieldErrors: { username: PROFILE_USERNAME_RESERVED_MESSAGE },
    };
  }

  if (values.username.trim().toLowerCase() === PREVIEW_TAKEN_USERNAME) {
    return {
      isSuccess: false,
      fieldErrors: { username: PROFILE_USERNAME_TAKEN_MESSAGE },
    };
  }

  return { isSuccess: true };
}
