import { ReactNode } from "react";
import { LearnerLoadError } from "./learner-load-error";
import { PartnerFooter } from "./partner-footer";

interface LearnerErrorDashboardProps {
  recommendedSection: ReactNode;
}

export function LearnerErrorDashboard({
  recommendedSection,
}: LearnerErrorDashboardProps) {
  return (
    <div className="flex flex-col gap-4">
      <LearnerLoadError />
      <div className="mt-4">{recommendedSection}</div>
      <div className="mt-4">
        <PartnerFooter />
      </div>
    </div>
  );
}
