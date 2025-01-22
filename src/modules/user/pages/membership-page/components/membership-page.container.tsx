"use client";

import { useUserContext } from "@/components/user-context";
import { commonPath } from "@/constants";
import { userMutationEnrollPackage } from "@/modules/course/services/data/mutation-enroll-package";
import { Heading } from "@/shared/components";
import {
  MembershipPlan,
  membershipPlans,
} from "@/shared/constants/user.constants";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PlanItem from "./plan-item";

export interface MembershipPageContainerProps {}

export function MembershipPageContainer(_props: MembershipPageContainerProps) {
  const mutationEnrollPackage = userMutationEnrollPackage();
  const { userInfo } = useUserContext();
  const userId = userInfo?._id.toString() || "";
  const router = useRouter();
  const handleMembership = async (amount: number, plan: MembershipPlan) => {
    if (!userInfo?._id) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
      router.push(commonPath.LOGIN);
      return;
    }
    try {
      const response = await mutationEnrollPackage.mutateAsync({
        amount,
        userId,
        plan,
      });
      if (response?.error) {
        toast.error(response?.error);
        return;
      }
      router.push(`/order/${response?.order.code}`);
    } catch (error) {}
  };

  return (
    <div>
      <Heading>Membership</Heading>
      <div className="mb-2">
        Tính năng này cho phép các bạn đăng ký các gói từ{" "}
        <strong>1 tháng</strong>, <strong>3 tháng</strong>,{" "}
        <strong>6 tháng</strong> và <strong>1 năm</strong>. Khi các bạn đăng ký
        các gói này thì có thể học toàn bộ khóa học trong thời hạn mà các bạn
        chọn.
      </div>
      <div className="mb-5">
        Sau khi thanh toán xong thì các bạn có thể vào khu vực học tập để có thể
        truy cập các khóa học nhé. Các huy hiệu và gói của các bạn mình sẽ cập
        nhật ở trang cá nhân sau.
      </div>
      <div className="grid lg:grid-cols-2 2xl:grid-cols-4 max-w-[700px] 2xl:max-w-full gap-2">
        {membershipPlans.map((item, index) => (
          <PlanItem
            isActive={item.plan === MembershipPlan.Master}
            key={index}
            price={item.price}
            title={item.plan}
            onButtonClick={() => handleMembership(item.price, item.plan)}
            img={item.icon}
            save={item.save}
            duration={item.duration}
          />
        ))}
      </div>
    </div>
  );
}
