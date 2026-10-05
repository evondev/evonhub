import { ReactNode, Suspense } from "react";
import { DashboardWelcome } from "./dashboard-welcome";
import { PartnerFooter } from "./partner-footer";
import { StudentRatings } from "./student-ratings";

interface OutsiderDashboardProps {
  /** Có tên là người đã đăng nhập nhưng chưa có khóa; không có là khách */
  firstName?: string;
  recommendedSection: ReactNode;
}

export function OutsiderDashboard({
  firstName,
  recommendedSection,
}: OutsiderDashboardProps) {
  return (
    <div className="flex flex-col gap-4">
      <DashboardWelcome firstName={firstName} />
      <div className="mt-4">{recommendedSection}</div>
      <div className="mt-4">
        <Suspense fallback={null}>
          <StudentRatings />
        </Suspense>
      </div>
      <div className="mt-4">
        <PartnerFooter />
      </div>
    </div>
  );
}
