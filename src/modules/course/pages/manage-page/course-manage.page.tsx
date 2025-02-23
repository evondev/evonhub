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
import { useUserContext } from "@/components/user-context";
import { courseStatus } from "@/constants";
import {
  Heading,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconEdit,
  IconEye,
  IconPlus,
  IconStudy,
} from "@/shared/components";
import { LabelStatus, PaginationControl } from "@/shared/components/common";
import { statusActions } from "@/shared/constants/common.constants";
import { CourseStatus } from "@/shared/constants/course.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useQueryCoursesManage } from "../../services";

export interface CourseManagePageProps {}

export function CourseManagePage(_props: CourseManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    isFree: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
    status: parseAsString.withDefault(""),
  });

  const { data: courses } = useQueryCoursesManage({
    search: filters.search,
    page: filters.page,
    limit: 10,
    isFree: filters.isFree,
    status: filters.status as CourseStatus,
  });

  const { userInfo } = useUserContext();
  const userRole = userInfo?.role;

  const canEdit =
    userRole && [UserRole.Admin, UserRole.Expert].includes(userRole);

  return (
    <>
      <Heading className="min-h-10">Quản lý khóa học</Heading>
      <div className="mb-2 flex items-center justify-between px-3 py-2 bgDarkMode borderDarkMode rounded-lg">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 text-sm font-medium">
            <Switch
              checked={filters.isFree}
              onCheckedChange={(checked) => setFilters({ isFree: checked })}
            />
            <Label
              htmlFor="paidUser"
              className="flex items-center gap-2 cursor-pointer"
            >
              <span>Khóa học miễn phí</span>
            </Label>
          </div>
          <div className="hidden lg:flex gap-3">
            {statusActions.map((item, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-2 h-7",
                  item.className
                )}
                onClick={() => setFilters({ status: item.value })}
              >
                {item.text}
                {filters.status === item.value && (
                  <IconCircleCheck className="size-4" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Tìm kiếm khóa học"
            className="w-full lg:w-[300px] h-10"
            onChange={(e) => setFilters({ search: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <PaginationControl
              onClick={() => setFilters({ page: filters.page - 1 })}
              disabled={filters.page <= 1}
            >
              <IconArrowLeft />
            </PaginationControl>
            <PaginationControl
              onClick={() => setFilters({ page: filters.page + 1 })}
              disabled={Number(courses?.length) <= 0}
            >
              <IconArrowRight />
            </PaginationControl>
          </div>
        </div>
      </div>
      <Link
        href="/admin/course/add-new"
        className="fixed bottom-10 right-10 z-50 size-10 bg-primary text-white flex items-center justify-center rounded-full"
        target="_blank"
      >
        <IconPlus />
      </Link>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Thông tin</TableHead>
            <TableHead>Giá khóa học</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses &&
            courses.length > 0 &&
            courses.map((course) => {
              return (
                <TableRow key={course.slug}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={200}
                        height={200}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0 border borderDarkMode"
                        priority
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-2">
                          <div className="font-bold line-clamp-2 w-[400px] block text-base text-balance">
                            {course.title}
                          </div>
                        </div>
                        <p className="font-medium text-xs text-gray-400">
                          Ngày tạo:{" "}
                          {new Date(course.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.free ? (
                      <LabelStatus className={courseStatus.approved.className}>
                        Miễn phí
                      </LabelStatus>
                    ) : (
                      <p className="font-semibold whitespace-nowrap text-primary">
                        {formatThoundsand(course.price)} VNĐ
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <LabelStatus
                      className={courseStatus[course.status].className}
                    >
                      {courseStatus[course.status].text}
                    </LabelStatus>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 justify-center text-gray-400 dark:text-white">
                      <Link
                        href={`/admin/course/content?slug=${course.slug}`}
                        target="_blank"
                        className="size-8 flex items-center justify-center border borderDarkMode rounded p-2 transition-all hover:text-gray-500 dark:hover:text-opacity-80"
                      >
                        <IconStudy></IconStudy>
                      </Link>
                      <Link
                        href={`/course/${course.slug}`}
                        target="_blank"
                        className="size-8 flex items-center justify-center border borderDarkMode rounded p-2 transition-all hover:text-gray-500 dark:hover:text-opacity-80"
                      >
                        <IconEye></IconEye>
                      </Link>
                      {canEdit && (
                        <>
                          <Link
                            href={`/admin/course/update?slug=${course.slug}`}
                            className="size-8 flex items-center justify-center border borderDarkMode rounded p-2 transition-all hover:text-gray-500 dark:hover:text-opacity-80"
                            target="_blank"
                          >
                            <IconEdit></IconEdit>
                          </Link>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}
