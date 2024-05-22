"use client";
import { IconDelete, IconEdit, IconEye } from "@/components/icons";
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
  primaryButtonClassName,
} from "@/constants";
import { ICourse } from "@/database/course.model";
import { deleteCourse } from "@/lib/actions/course.action";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import { Role } from "@/types/enums";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

const CourseManage = ({ courses }: { courses: ICourse[] }) => {
  const { permissions, userRole } = useGlobalStore();
  const handleDeleteCourse = async (slug: string) => {
    Swal.fire({
      title: "Bạn có muốn xóa khóa học này không ?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCourse(slug);
        Swal.fire("Xóa khóa học thành công", "", "success");
      }
    });
  };
  return (
    <div className="hidden lg:block">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Quản lý khóa học</h1>
        <Link href="/admin/course/add-new" className={primaryButtonClassName}>
          Tạo khóa học mới
        </Link>
      </div>

      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Giá khóa học</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell colSpan={999} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.slug}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={128}
                    height={128}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-start gap-2 group">
                      <Link
                        href={`/admin/course/content?slug=${course.slug}`}
                        target="_blank"
                        className="font-bold text-base line-clamp-2 max-w-[400px] block"
                      >
                        {course.title}
                      </Link>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 group-hover:text-primary transition-all"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-semibold whitespace-nowrap">
                  {formatThoundsand(course.price)} VNĐ
                </p>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    courseStatusClassName,
                    courseStatus[course.status].className
                  )}
                >
                  {courseStatus[course.status].text}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4 justify-center text-gray-400 dark:text-white">
                  <Link
                    href={`/course/${course.slug}`}
                    target="_blank"
                    className={cn(actionClassName)}
                  >
                    <IconEye></IconEye>
                  </Link>
                  {userRole && [Role.ADMIN, Role.EXPERT].includes(userRole) && (
                    <>
                      <Link
                        href={`/admin/course/update?slug=${course.slug}`}
                        className={cn(actionClassName)}
                      >
                        <IconEdit></IconEdit>
                      </Link>
                    </>
                  )}
                  {userRole && [Role.ADMIN].includes(userRole) && (
                    <button
                      className={cn(actionClassName)}
                      onClick={() => handleDeleteCourse(course.slug)}
                    >
                      <IconDelete />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseManage;
