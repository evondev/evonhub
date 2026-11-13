import { InterviewQuizPreviewPage } from "@/modules/interview/pages";
import { notFound } from "next/navigation";

export default function InterviewQuizPreviewRoute() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <InterviewQuizPreviewPage />;
}
