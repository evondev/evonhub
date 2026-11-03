import { isWebUrl } from "@/shared/helpers/url.helper";
import { format } from "date-fns";
import {
  PREVIEW_TAKEN_USERNAME,
  PROFILE_RESERVED_USERNAME_PARTS,
  PROFILE_RESERVED_USERNAMES,
  PROFILE_USERNAME_RESERVED_MESSAGE,
  PROFILE_SOCIAL_LINK_ITEMS,
  PROFILE_USERNAME_TAKEN_MESSAGE,
} from "../constants";
import {
  ProfilePublicFormValues,
  ProfileSaveResult,
  ProfileSocialFormValues,
  ProfileSocialLink,
} from "../types";

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

/** Mạng xã hội user đã điền và là link web thật; không điền thì không hiện icon */
export function getProfileSocialLinks(
  socials: Partial<ProfileSocialFormValues> | undefined,
): ProfileSocialLink[] {
  return PROFILE_SOCIAL_LINK_ITEMS.flatMap((item) => {
    const url = socials?.[item.name]?.trim();

    return isWebUrl(url) ? [{ ...item, url }] : [];
  });
}

/** Mốc tham gia trên trang công khai: "03/2024" */
export function formatJoinedMonth(date: Date | string): string {
  return format(new Date(date), "MM/yyyy");
}
