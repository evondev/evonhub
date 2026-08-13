import {
  MembershipPlan,
  membershipPlans,
} from "@/shared/constants/user.constants";
import dayjs from "dayjs";

export interface MembershipFields {
  plan: MembershipPlan;
  isMembership: boolean;
  planStartDate?: Date;
  planEndDate?: Date;
}

/**
 * Các field cần set khi duyệt đơn membership. Thời hạn lấy theo `duration`
 * (số tháng) của gói trong `membershipPlans`.
 */
export function getMembershipFields(plan: MembershipPlan): MembershipFields {
  const selectedPlan = membershipPlans.find((item) => item.plan === plan);

  if (!selectedPlan) return getClearedMembershipFields();

  return {
    plan,
    isMembership: true,
    planStartDate: dayjs().toDate(),
    planEndDate: dayjs().add(selectedPlan.duration, "month").toDate(),
  };
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
