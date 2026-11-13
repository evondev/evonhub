import { LoadErrorState } from "@/shared/components/common";
import { notFound } from "next/navigation";
import { fetchInterviewSession } from "../../actions";
import { InterviewQuiz } from "../../components";

interface InterviewQuizPageProps {
  courseSlug: string;
}

export async function InterviewQuizPage({ courseSlug }: InterviewQuizPageProps) {
  const session = await fetchInterviewSession(courseSlug);

  // null: không có khoá, chưa mua, hoặc khoá chưa có câu nào đã đăng
  if (session === null) notFound();

  if (!session) {
    return <LoadErrorState title="Không tải được câu hỏi" className="mx-auto max-w-3xl" />;
  }

  return <InterviewQuiz session={session} />;
}
