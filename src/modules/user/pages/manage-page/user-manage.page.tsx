"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userStatus } from "@/constants";
import { cn } from "@/lib/utils";
import { IconArrowLeft, IconArrowRight, IconStar } from "@/shared/components";
import { LabelStatus, PaginationControl } from "@/shared/components/common";
import Image from "next/image";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useQueryUsers } from "../../services/data/query-users.data";

export interface UserManagePageProps {}

export function UserManagePage(_props: UserManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    isPaidUser: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
  });

  const { data } = useQueryUsers({
    search: filters.search,
    page: filters.page,
    limit: 20,
    isPaid: filters.isPaidUser,
  });

  if (!data) return null;
  const { total, users } = data;

  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Quản lý thành viên ({total})
        </h1>
        <Input
          placeholder="Tìm kiếm thành viên"
          className="w-full lg:w-[300px]"
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>
      <div className="mb-2 flex items-center justify-between px-4 py-2 bgDarkMode borderDarkMode rounded-lg">
        <div className="flex items-center gap-3 text-sm font-medium">
          <Switch
            checked={filters.isPaidUser}
            onCheckedChange={(checked) => setFilters({ isPaidUser: checked })}
          />
          <Label
            htmlFor="paidUser"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>Thành viên trả phí</span>
          </Label>
        </div>
        <div className="flex justify-end gap-3">
          <PaginationControl
            onClick={() => setFilters({ page: filters.page - 1 })}
            disabled={filters.page <= 1}
          >
            <IconArrowLeft />
          </PaginationControl>
          <PaginationControl
            onClick={() => setFilters({ page: filters.page + 1 })}
          >
            <IconArrowRight />
          </PaginationControl>
        </div>
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead className="hidden lg:table-cell star"></TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((item) => (
            <TableRow key={item.username}>
              <TableCell className="hidden lg:table-cell star">
                {item.courses.filter((el) => !el.free).length > 0 && (
                  <IconStar className="size-6 text-primary max-w-none" />
                )}
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/user/update?email=${item.email}`}
                  className="flex items-center gap-3"
                  target="_blank"
                  rel="noreferrer"
                >
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
                    <h5 className="font-semibold">{item.email}</h5>
                    <p className="text-xs text-gray-400">
                      {new Date(item?.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="pl-10 lg:pl-4">
                <div className="flex flex-col gap-3 font-semibold">
                  {item.courses.map((course, index) => (
                    <Link
                      href={`/course/${course.slug}`}
                      key={index}
                      className="flex text-sm items-baseline gap-1 lg:max-w-xs break-words lg:text-balance whitespace-nowrap lg:whitespace-normal"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="size-2 bg-current rounded-sm shrink-0"></span>{" "}
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
                >
                  {userStatus[item.status]?.text}
                </LabelStatus>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
