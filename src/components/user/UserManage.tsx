"use client";
import { IconDelete, IconEdit } from "@/components/icons";
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
  actionClassName,
  courseStatus,
  courseStatusClassName,
} from "@/constants";
import { IUser } from "@/database/user.model";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/utils";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
const UserManage = ({ users, count }: { users: IUser[]; count: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleFilter = (filter: string) => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "search",
      value: filter,
    });
    router.push(newUrl);
  };
  return (
    <div>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-extrabold">
          Quản lý thành viên({count})
        </h1>
        <Input
          placeholder="Tìm kiếm thành viên"
          className="w-full lg:w-[300px]"
          onChange={debounce((e) => handleFilter(e.target.value), 300)}
        />
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((item) => (
            <TableRow key={item.username}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={item.avatar}
                    alt={item.username}
                    width={64}
                    height={64}
                    className="w-12 h-12 object-cover rounded-full flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-base line-clamp-2 whitespace-nowrap max-w-[100px] lg:max-w-[400px] block">
                      {item.name}
                    </h4>
                    <h5>{item.username}</h5>
                    <h5>{item.email}</h5>
                    <p className="text-sm text-gray-400">
                      {new Date(item.joinedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    courseStatusClassName,
                    courseStatus.approved.className
                  )}
                >
                  Đang hoạt động
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4 justify-center text-gray-400 dark:text-white">
                  <Link
                    href={`/admin/user/update?username=${item.username}`}
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
