import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import {
  DashboardSkeleton,
  LearnerOverview,
  OutsiderOverview,
} from "../components";

export function DashboardPage() {
  const { userId } = auth();

  return (
    <Suspense fallback={<DashboardSkeleton isSignedIn={!!userId} />}>
      {userId ? <LearnerOverview clerkUserId={userId} /> : <OutsiderOverview />}
    </Suspense>
  );
}
