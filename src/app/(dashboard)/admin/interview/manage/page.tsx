import { InterviewManagePage } from "@/modules/interview/pages";

// Action tạo câu bằng AI chạy trên route này; mặc định của Vercel quá ngắn cho một lô câu
export const maxDuration = 60;

export default function InterviewManagePageRoot() {
  return <InterviewManagePage />;
}
