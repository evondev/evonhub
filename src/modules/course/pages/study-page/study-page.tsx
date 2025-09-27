import { Heading } from "@/shared/components";
import { StudyPageContainer } from "./study-page-container";

export interface StudyPageProps {}

export function StudyPage(_props: StudyPageProps) {
  return (
    <div className="flex flex-col gap-5">
      <Heading>Khu vực học tập</Heading>
      <StudyPageContainer />
    </div>
  );
}
