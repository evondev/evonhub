import { Heading } from "@/shared/components";
import { StudyPageContainer } from "./study-page-container";

export interface StudyPageProps {}

export function StudyPage(_props: StudyPageProps) {
  return (
    <div>
      <Heading>Khu vực học tập</Heading>
      <StudyPageContainer />
    </div>
  );
}
