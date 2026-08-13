"use client";

import { useUserContext } from "@/components/user-context";
import { membershipPlans } from "@/shared/constants/user.constants";
import { useGlobalStore } from "@/store";
import { PlanCard } from "./plan-card";

export interface UserPlanProps {}

export function UserPlan(_props: UserPlanProps) {
  const { isMembershipUserActive } = useGlobalStore();
  const { userInfo } = useUserContext();
  const planDetails = membershipPlans.find(
    (item) => item.plan === userInfo?.plan
  );
  if (!planDetails || !isMembershipUserActive) return null;

  return (
    <div className="w-[320px] shrink-0 relative">
      <div className="rounded-animation" />
      <PlanCard
        price={planDetails.price}
        title={planDetails.plan}
        img={planDetails.icon}
        duration={planDetails.duration}
      />
    </div>
  );
}
