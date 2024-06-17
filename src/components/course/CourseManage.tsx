"use client";
import { IconDelete, IconEdit, IconEye, IconStudy } from "@/components/icons";
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
import LabelStatus from "../common/LabelStatus";

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
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl lg:text-3xl font-bold">Quản lý khóa học</h1>
        <Link href="/admin/course/add-new" className={primaryButtonClassName}>
          Tạo khóa học mới
        </Link>
      </div>

      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Giá khóa học</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
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
          {courses.map((course) => {
            return (
              <TableRow key={course.slug}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={200}
                      height={200}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-start gap-2">
                        <div className="font-bold line-clamp-2 w-[400px] block text-sm">
                          {course.title}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-400">
                        Ngày tạo:{" "}
                        {new Date(course.createdAt).toLocaleDateString("vi-VN")}
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
                      className={cn(actionClassName)}
                    >
                      <IconStudy></IconStudy>
                    </Link>
                    <Link
                      href={`/course/${course.slug}`}
                      target="_blank"
                      className={cn(actionClassName)}
                    >
                      <IconEye></IconEye>
                    </Link>
                    {userRole &&
                      [Role.ADMIN, Role.EXPERT].includes(userRole) && (
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
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default CourseManage;
