/** Link người dùng tự nhập (mạng xã hội) chỉ gắn vào href khi là http(s), chặn javascript: */
export function isWebUrl(url: string | undefined): url is string {
  return !!url && /^https?:\/\//i.test(url.trim());
}
