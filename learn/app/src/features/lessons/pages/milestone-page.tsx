import { Suspense } from "react";
import { MilestoneBody } from "../components";

interface MilestonePageProps {
  milestoneSlugPromise: Promise<string>;
}

export default function MilestonePage({ milestoneSlugPromise }: MilestonePageProps) {
  return (
    <div className="flex-1">
      <Suspense fallback={<div className="h-14 border-b border-border-strong bg-surface" />}>
        <MilestoneBody milestoneSlugPromise={milestoneSlugPromise} />
      </Suspense>
    </div>
  );
}
