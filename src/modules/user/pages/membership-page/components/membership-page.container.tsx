"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/components/user-context";
import { commonPath } from "@/constants";
import { userMutationEnrollPackage } from "@/modules/course/services/data/mutation-enroll-package";
import { Heading } from "@/shared/components";
import { UserPackage } from "@/shared/constants/user.constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import PackageItem from "./package-item";

export interface MembershipPageContainerProps {}

export function MembershipPageContainer(_props: MembershipPageContainerProps) {
  const [selectedPackage, setSelectedPackage] = useState(UserPackage.Month);

  const packages: {
    title: string;
    price: number;
    package: UserPackage;
    img: string;
  }[] = [
    {
      title: "1 tháng",
      price: 150_000,
      package: UserPackage.Month,
      img: "/star-medal.png",
    },
    {
      title: "3 tháng",
      price: 400_000,
      package: UserPackage.Quarter,
      img: "/gold-medal.png",
    },
    {
      title: "6 tháng",
      price: 700_000,
      package: UserPackage.HalfYear,
      img: "/trophy-star-2.png",
    },
    {
      title: "12 tháng",
      price: 1_200_000,
      package: UserPackage.Year,
      img: "/trophy-star.png",
    },
  ];

  const mutationEnrollPackage = userMutationEnrollPackage();
  const { userInfo } = useUserContext();
  const userId = userInfo?._id.toString() || "";
  const router = useRouter();
  const amount = Number(
    packages.find((item) => item.package === selectedPackage)?.price
  );
  const handleMembership = async () => {
    if (!userInfo?._id) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
      router.push(commonPath.LOGIN);
      return;
    }
    try {
      const response = await mutationEnrollPackage.mutateAsync({
        amount,
        userId,
        plan: selectedPackage,
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
      <div className="mb-10">
        Tính năng này cho phép các bạn đăng ký các gói từ{" "}
        <strong>1 tháng</strong>, <strong>3 tháng</strong>,{" "}
        <strong>6 tháng</strong> và <strong>1 năm</strong>. Khi các bạn đăng ký
        các gói này thì có thể học toàn bộ khóa học trong thời hạn mà các bạn
        chọn. Khi hết hạn thì sẽ quay lại như bình thường.
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {packages.map((item, index) => (
          <PackageItem
            isActive={selectedPackage === item.package}
            key={index}
            price={item.price}
            title={item.title}
            onClick={() => setSelectedPackage(item.package)}
            img={item.img}
          />
        ))}
      </div>
      <div className="flex items-center justify-end mt-8">
        <Button className="button-mix w-[200px]" onClick={handleMembership}>
          Thanh toán
        </Button>
      </div>
    </div>
  );
}
