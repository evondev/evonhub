/** Mảng mới với phần tử ở vị trí index đã thay */
export function replaceItemAt<TItem>(items: TItem[], index: number, nextItem: TItem): TItem[] {
  return items.map((item, itemIndex) => (itemIndex === index ? nextItem : item));
}

/** Mảng mới đã bỏ phần tử ở vị trí index */
export function removeItemAt<TItem>(items: TItem[], index: number): TItem[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

/** Mảng mới đã đổi chỗ phần tử index với phần tử bên cạnh (-1 lên, 1 xuống) */
export function moveItem<TItem>(items: TItem[], index: number, direction: -1 | 1): TItem[] {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= items.length) return items;

  const movedItems = [...items];
  [movedItems[index], movedItems[targetIndex]] = [movedItems[targetIndex], movedItems[index]];

  return movedItems;
}

/** Mảng mới đã thêm giá trị nếu chưa có, bỏ đi nếu đã có */
export function toggleItem<TItem>(items: TItem[], item: TItem): TItem[] {
  return items.includes(item) ? items.filter((currentItem) => currentItem !== item) : [...items, item];
}
