/**
 * Chiều cao để mục cuối lộ đúng một nửa, báo "còn nữa" khi thanh cuộn đang ẩn.
 * Mỗi mục gắn data-peek-item.
 */
export function getPeekListHeight(
  listElement: HTMLElement,
  maxHeight: number,
): number {
  if (listElement.scrollHeight <= maxHeight) return listElement.scrollHeight;

  const listTop =
    listElement.getBoundingClientRect().top - listElement.scrollTop;
  let peekHeight = maxHeight;

  for (const item of listElement.querySelectorAll<HTMLElement>(
    "[data-peek-item]",
  )) {
    const itemRect = item.getBoundingClientRect();
    const itemMiddle = itemRect.top - listTop + itemRect.height / 2;

    if (itemMiddle > maxHeight) break;
    peekHeight = itemMiddle;
  }

  return peekHeight;
}
