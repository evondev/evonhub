import { Input } from "@/components/ui/input";
import { primaryButtonClassName } from "@/constants";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Quản lý Coupon</h1>
        <div className="flex gap-5">
          <Input placeholder="Tìm kiếm..." className="w-full lg:w-[300px]" />
          <Link href="/admin/coupon/create" className={primaryButtonClassName}>
            Tạo coupon
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
