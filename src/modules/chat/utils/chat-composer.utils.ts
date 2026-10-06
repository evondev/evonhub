/** Ô nhập cao tối đa khoảng 6 dòng, dài hơn thì cuộn trong ô */
const COMPOSER_MAX_HEIGHT_PX = 160;

/** Ô nhập cao theo nội dung */
export function resizeComposer(textarea: HTMLTextAreaElement | null) {
  if (!textarea) return;

  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, COMPOSER_MAX_HEIGHT_PX)}px`;
}

/** Chèn chữ vào đúng vùng đang chọn, thay phần bôi đen nếu có */
export function insertTextAtSelection(
  text: string,
  insertedText: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  return text.slice(0, selectionStart) + insertedText + text.slice(selectionEnd);
}
