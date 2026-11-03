import OpenAI from "openai";

/** Đổi model qua env, không cần sửa code */
export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

let openaiClient: OpenAI | null = null;

// Tạo lúc gọi lần đầu: new OpenAI() ném lỗi khi thiếu OPENAI_API_KEY, tạo sẵn
// lúc import thì mọi trang import action AI đều vỡ theo
export function getOpenAIClient() {
  if (!openaiClient) openaiClient = new OpenAI();

  return openaiClient;
}
