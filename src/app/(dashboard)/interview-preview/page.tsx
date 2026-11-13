import { InterviewCoursesPreviewPage } from "@/modules/interview/pages";
import { PREVIEW_INTERVIEW_COURSES_STATE_LINKS } from "@/modules/interview/constants/interview-preview.constants";
import { notFound } from "next/navigation";

interface InterviewPreviewRouteProps {
  searchParams: { tt?: string };
}

export default function InterviewPreviewRoute({ searchParams }: InterviewPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PREVIEW_INTERVIEW_COURSES_STATE_LINKS.find((stateLink) => stateLink.state === searchParams.tt);

  return <InterviewCoursesPreviewPage state={matchedState?.state || "du-lieu"} />;
}
