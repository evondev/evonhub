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
import { Heading, IconArrowLeft, IconArrowRight } from "@/shared/components";
import { LabelStatus, PaginationControl } from "@/shared/components/common";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { debounce } from "lodash";
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
    limit: ITEMS_PER_PAGE,
    isPaid: filters.isPaidUser,
  });

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ search: value });
  }, 500);

  if (!data) return null;
  const { total, users } = data;

  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <Heading className="mb-0">Quản lý thành viên ({total})</Heading>
        <Input
          placeholder="Tìm kiếm thành viên"
          className="w-full lg:w-[300px]"
          onChange={handleSearch}
        />
      </div>
      <div className="mb-2 flex items-center justify-between px-3 py-2 bgDarkMode borderDarkMode rounded-lg">
        <div className="flex items-center gap-3 text-sm font-medium">
          <Switch
            checked={filters.isPaidUser}
            onCheckedChange={(checked) => setFilters({ isPaidUser: checked })}
          />
          <Label
            htmlFor="paidUser"
            className="hidden lg:flex items-center gap-2 cursor-pointer"
          >
            <span>Thành viên trả phí</span>
          </Label>
        </div>
        <div className="flex justify-end gap-3">
          <PaginationControl
            onClick={debounce(
              () => setFilters({ page: filters.page - 1 }),
              300
            )}
            disabled={filters.page <= 1}
          >
            <IconArrowLeft />
          </PaginationControl>
          <PaginationControl
            onClick={debounce(
              () => setFilters({ page: filters.page + 1 }),
              300
            )}
          >
            <IconArrowRight />
          </PaginationControl>
        </div>
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Thông tin</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((item) => (
            <TableRow key={item.username}>
              <TableCell>
                <Link
                  href={`/admin/user/update?email=${item.email}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.avatar}
                    alt={item.username}
                    width={64}
                    height={64}
                    className="size-10 object-cover rounded-full flex-shrink-0 borderDarkMode"
                  />
                  <div className="whitespace-nowrap">
                    <h4 className="font-bold text-sm line-clamp-2 whitespace-nowrap max-w-[400px] block">
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
              <TableCell className="pl-10">
                <div className="flex flex-col items-start lg:flex-row flex-wrap gap-2 font-semibold">
                  {item.courses.map((course, index) => (
                    <Link
                      href={`/course/${course.slug}`}
                      key={index}
                      className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-grayDarkest dark:text-gray-200 text-xs whitespace-nowrap"
                      target="_blank"
                      rel="noreferrer"
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
