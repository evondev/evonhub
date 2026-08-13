import { MembershipPlan } from "@/shared/constants/user.constants";

export interface MembershipFields {
  plan: MembershipPlan;
  isMembership: boolean;
  planStartDate?: Date;
  planEndDate?: Date;
}

/** Các field cần set khi hủy membership của user. */
export function getClearedMembershipFields(): MembershipFields {
  return {
    plan: MembershipPlan.None,
    isMembership: false,
    planStartDate: undefined,
    planEndDate: undefined,
  };
}
