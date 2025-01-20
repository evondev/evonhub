"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/shared/components";
import { UserPackage } from "@/shared/constants/user.constants";
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

  const handleMembership = async () => {
    toast.error("Chức năng này đang được phát triển");
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
