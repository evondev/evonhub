"use client";

import { useUserContext } from "@/components/user-context";
import { commonPath } from "@/constants";
import { userMutationEnrollPackage } from "@/modules/course/services/data/mutation-enroll-package";
import { Heading } from "@/shared/components";
import { MembershipPlan } from "@/shared/constants/user.constants";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
    <div className="flex flex-col gap-5">
      <Heading>Tính năng này đang tạm ngưng</Heading>
      {/* <div className="mb-5 leading-loose">
        <div>
          Tính năng này cho phép các bạn đăng ký các gói từ{" "}
          <strong>1 tháng</strong>, <strong>3 tháng</strong>,{" "}
          <strong>6 tháng</strong> và <strong>1 năm</strong>. Khi các bạn đăng
          ký các gói này thì có thể học toàn bộ khóa học trong thời hạn mà các
          bạn chọn.
        </div>
        <div>
          Sau khi thanh toán xong thì các bạn có thể vào khu vực học tập để có
          thể truy cập các khóa học. Còn thông tin gói và thời hạn các bạn có
          thể truy cập vào mục <strong>Profile</strong>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-4 2xl:max-w-full gap-5 xl:gap-2">
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
      </div> */}
    </div>
  );
}
