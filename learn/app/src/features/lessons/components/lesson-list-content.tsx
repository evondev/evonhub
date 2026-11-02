import { connection } from "next/server";
import { readApiModuleStatuses } from "../services/api-modules";
import { readLabProgress } from "../services/progress-store";
import { buildFoundationLessons, buildRoadmapGroups } from "../utils/roadmap";
import ApiModuleCard from "./api-module-card";
import FoundationLessonList from "./foundation-lesson-list";
import RoadmapExplorer from "./roadmap-explorer";

export default async function LessonListContent() {
  // Tiến độ và .env.local đọc từ file mỗi lần mở trang, không được prerender lúc build.
  await connection();
  const [labProgress, moduleStatuses] = await Promise.all([readLabProgress(), readApiModuleStatuses()]);

  return (
    <RoadmapExplorer
      stageGroups={buildRoadmapGroups(labProgress)}
      belowList={<FoundationLessonList lessons={buildFoundationLessons(labProgress)} />}
      belowDetail={<ApiModuleCard moduleStatuses={moduleStatuses} />}
    />
  );
}
