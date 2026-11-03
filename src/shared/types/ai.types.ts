export type AiDescriptionLength = "short" | "long";

/** Thông tin video gửi cho AI, lấy từ form đang sửa */
export interface AiVideoContext {
  title: string;
  /** Tên danh mục, không phải id */
  category?: string;
  /** Nhãn trình độ, ví dụ "Cơ bản" */
  level?: string;
  /** Mô tả đang có (HTML từ editor), cho AI biết video nói về gì cụ thể */
  description?: string;
}

export interface SuggestTitlesInput extends AiVideoContext {
  /** Hướng admin muốn thêm, ví dụ "hài hơn", "ngắn dưới 50 ký tự" */
  direction?: string;
}

export interface SuggestDescriptionInput extends AiVideoContext {
  length: AiDescriptionLength;
}

export interface AiTitleSuggestion {
  title: string;
  /** Kiểu hook: tò mò, con số, nỗi đau, kết quả... */
  hook: string;
}

export interface AiDescriptionLengthOption {
  value: AiDescriptionLength;
  label: string;
  hint: string;
}

export type AiActionResult<TData> =
  | { type: "success"; data: TData }
  | { type: "error"; message: string };
