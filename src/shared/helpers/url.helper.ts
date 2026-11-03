import { PROFILE_PUBLIC_PATH } from "@/shared/constants/user.constants";

/** Link người dùng tự nhập (mạng xã hội) chỉ gắn vào href khi là http(s), chặn javascript: */
export function isWebUrl(url: string | undefined): url is string {
  return !!url && /^https?:\/\//i.test(url.trim());
}

export function buildPublicProfilePath(username: string) {
  return `${PROFILE_PUBLIC_PATH}/${username.trim()}`;
}
