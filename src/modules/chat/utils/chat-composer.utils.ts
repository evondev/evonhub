/** Chèn chữ vào đúng vùng đang chọn, thay phần bôi đen nếu có */
export function insertTextAtSelection(
  text: string,
  insertedText: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  return (
    text.slice(0, selectionStart) + insertedText + text.slice(selectionEnd)
  );
}
