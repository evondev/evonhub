"use client";
import { IconDelete, IconEdit } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { actionClassName, primaryButtonClassName } from "@/constants";
import { ICourse } from "@/database/course.model";
import { deleteCourse } from "@/lib/actions/course.action";
import { cn } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

const CourseManage = ({ courses }: { courses: ICourse[] }) => {
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
        revalidatePath("/admin/course/manage");
        Swal.fire("Xóa khóa học thành công", "", "success");
      }
    });
  };
  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-xl font-bold">Quản lý khóa học</h1>
        <Link href="/admin/course/add-new" className={primaryButtonClassName}>
          Tạo khóa học mới
        </Link>
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker">
        <TableHeader>
          <TableRow className="rounded-t-lg ">
            <TableHead></TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Giá khóa học</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.slug}>
              <TableCell></TableCell>
              <TableCell>
                <div className="flex items-center gap-5">
                  <Image
                    src={
                      "https://spotlight-modern.highfivethemes.com/content/images/size/w800/format/webp/2023/06/demo-image-00002-1.webp"
                    }
                    alt={course.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-base">{course.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-semibold">
                  {course?.price?.toLocaleString() || 0} VNĐ
                </p>
              </TableCell>
              <TableCell>
                <span className="text-xs font-semibold dark:bg-green-950 dark:text-green-50 text-green-950 bg-green-100 inline-flex py-1 px-3 rounded-full">
                  Approved
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4 justify-center text-gray-400 dark:text-white">
                  <Link
                    href={`/admin/course/update?slug=${course.slug}`}
                    className={cn(actionClassName, "hover:bg-blue-500")}
                  >
                    <IconEdit></IconEdit>
                  </Link>
                  <button
                    className={cn(actionClassName, "hover:bg-red-500")}
                    onClick={() => handleDeleteCourse(course.slug)}
                  >
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

export default CourseManage;
