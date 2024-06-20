"use client";
import { IconDelete, IconEdit, IconStar } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  ArrowRight,
  actionClassName,
  pagiBtn,
  userStatus,
} from "@/constants";
import { updateUser } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { EUserStatus } from "@/types/enums";
import { formUrlQuery } from "@/utils";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LabelStatus from "../common/LabelStatus";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
interface IUserManageProps {
  name: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  status: EUserStatus;
  clerkId: string;
  courses: { title: string; slug: string; price: number; free: boolean }[];
}

const UserManage = ({
  users,
  count,
}: {
  users: IUserManageProps[];
  count: number;
}) => {
  const [page, setPage] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPaidUser, setIsPaidUser] = useState(
    searchParams?.get("paidUser") === "true"
  );
  const handleFilter = (filter: string) => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "search",
      value: filter,
    });
    router.push(newUrl);
  };
  const handleFilterPaidUser = (checked: boolean) => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "paidUser",
      value: checked ? "true" : "",
    });
    router.push(newUrl);
  };
  const handleChangeUserStatus = async (
    clerkId: string,
    status: EUserStatus
  ) => {
    try {
      Swal.fire({
        icon: "warning",
        title: "Bạn có chắc chắn muốn thay đổi trạng thái?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateUser({
            clerkId,
            updateData: {
              status:
                status === EUserStatus.ACTIVE
                  ? EUserStatus.INACTIVE
                  : EUserStatus.ACTIVE,
            },
            path: "/admin/user/manage",
          });
          toast.success("Cập nhật trạng thái thành công");
        }
      });
    } catch (error) {}
  };
  const handleChangePage = (action: "prev" | "next") => {
    if (page === 1 && action === "prev") return;
    if (action === "prev") {
      setPage((prev) => prev - 1);
    } else {
      setPage((prev) => prev + 1);
    }
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "page",
      value: action === "prev" ? `${page - 1}` : `${page + 1}`,
    });
    router.push(newUrl);
  };
  return (
    <div>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Quản lý thành viên({count})
        </h1>
        <Input
          placeholder="Tìm kiếm thành viên"
          className="w-full lg:w-[300px]"
          onChange={debounce((e) => handleFilter(e.target.value), 300)}
        />
      </div>
      <div className="mb-2 flex items-center justify-between px-4 py-2 bgDarkMode borderDarkMode rounded-lg">
        <div className="flex items-center gap-3 text-sm font-medium">
          <Checkbox
            defaultChecked={isPaidUser}
            onCheckedChange={(checked) =>
              handleFilterPaidUser(checked as boolean)
            }
            id="paidUser"
          />
          <Label
            htmlFor="paidUser"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>Thành viên trả phí</span>
            <IconStar className="size-6 text-secondary" />
          </Label>
        </div>
        <div className="flex justify-end gap-3">
          <button className={pagiBtn} onClick={() => handleChangePage("prev")}>
            {ArrowLeft}
          </button>
          <button className={pagiBtn} onClick={() => handleChangePage("next")}>
            {ArrowRight}
          </button>
        </div>
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead className="star">
              <Checkbox />
            </TableHead>
            <TableHead className="hidden lg:table-cell star"></TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((item) => (
            <TableRow key={item.username} className="break-all">
              <TableCell className="star">
                <Checkbox />
              </TableCell>
              <TableCell className="hidden lg:table-cell star">
                {item.courses.filter((el) => !el.free).length > 0 && (
                  <IconStar className="size-6 text-secondary max-w-none" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={item.avatar}
                    alt={item.username}
                    width={64}
                    height={64}
                    className="size-10 object-cover rounded-full flex-shrink-0 borderDarkMode"
                  />
                  <div className="whitespace-nowrap">
                    <h4 className="font-bold text-sm lg:text-base line-clamp-2 whitespace-nowrap max-w-[400px] block">
                      {item.name}
                    </h4>
                    <h5>{item.username}</h5>
                    <h5>{item.email}</h5>
                    <p className="text-sm text-gray-400">
                      {new Date(item?.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="pl-10 lg:pl-4">
                <div className="flex flex-col gap-2 font-semibold">
                  {item.courses.map((course, index) => (
                    <Link
                      href={`/course/${course.slug}`}
                      key={index}
                      className="flex text-sm items-center gap-1 whitespace-nowrap"
                    >
                      {course.title}
                    </Link>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <LabelStatus
                  className={cn(
                    userStatus[item.status]?.className,
                    "cursor-pointer"
                  )}
                  onClick={() =>
                    handleChangeUserStatus(item.clerkId, item.status)
                  }
                >
                  {userStatus[item.status]?.text}
                </LabelStatus>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4 justify-center text-gray-400 dark:text-white">
                  <Link
                    href={`/admin/user/update?email=${item.email}`}
                    className={cn(actionClassName)}
                  >
                    <IconEdit></IconEdit>
                  </Link>
                  <button className={cn(actionClassName)}>
                    <IconDelete />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManage;
