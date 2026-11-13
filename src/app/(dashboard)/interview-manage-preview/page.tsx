import { InterviewManagePreviewPage } from "@/modules/interview/pages";
import { PREVIEW_INTERVIEW_MANAGE_STATE_LINKS } from "@/modules/interview/constants/interview-preview.constants";
import { notFound } from "next/navigation";

interface InterviewManagePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function InterviewManagePreviewRoute({ searchParams }: InterviewManagePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PREVIEW_INTERVIEW_MANAGE_STATE_LINKS.find((stateLink) => stateLink.state === searchParams.tt);

  return <InterviewManagePreviewPage state={matchedState?.state || "du-lieu"} />;
}
