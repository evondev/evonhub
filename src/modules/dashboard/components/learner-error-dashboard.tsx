import { LearnerLoadError } from "./learner-load-error";
import { PartnerFooter } from "./partner-footer";

export function LearnerErrorDashboard() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <LearnerLoadError />
      <PartnerFooter />
    </div>
  );
}
