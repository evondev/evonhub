"use client";
import {
  TUserPermission,
  primaryButtonClassName,
  userPermissions,
} from "@/constants";
import {
  addCourseToUser,
  removeCourseFromUser,
  updateUserByUsername,
} from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enums";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { IconDelete } from "../icons";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const IconPlus = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);
const UserUpdateCourse = ({ user, courses }: { user: any; courses: any[] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRemoveCourseFromUser = async (courseId: string) => {
    try {
      Swal.fire({
        title: "Bạn có muốn xóa khóa học của user không ?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        icon: "warning",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removeCourseFromUser({
            userId: user.clerkId,
            courseId: courseId,
            path: `/admin/user/update?username=${user.username}`,
          });
          toast.success("Xóa khóa học thành công");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const handleAddCourseToUser = async () => {
    setIsSubmitting(true);
    try {
      Swal.fire({
        title: "Bạn đã xem giá tiền và discount chưa?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        icon: "warning",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const discountValue = Number(discount?.toString()?.replace(/,/g, ""));
          const res = await addCourseToUser({
            userId: user.clerkId,
            course: {
              id: selectCourse?._id.toString(),
              price: selectCourse?.price,
              discount: discountValue,
            },
            path: `/admin/user/update?username=${user.username}`,
          });
          if (res?.type === "error") {
            return toast.error(res.message);
          }
          toast.success("Thêm khóa học thành công");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [isUpdatePermissions, setIsUpdatePermissions] = useState(false);
  const handleUpdatePermissions = async () => {
    setIsUpdatePermissions(true);
    try {
      await updateUserByUsername({
        username: user.username,
        updateData: {
          permissions: selectPermissions,
          role: userRole,
        },
      });
      toast.success("Cập nhật quyền thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatePermissions(false);
    }
  };
  const [selectCourse, setSelectCourse] = useState<any>(null);
  const [discount, setDiscount] = useState<number | string>(0);
  const [userRole, setUserRole] = useState(user.role);
  const [selectPermissions, setSelectPermissions] = useState<string[]>(
    user.permissions || []
  );
  return (
    <div className="l-container">
      <div className="mb-5 flex flex-col gap-3 pb-5 border-b border-dashed border-gray-400 dark:border-grayDarker">
        <Image
          src={user.avatar}
          alt={user.username}
          width={100}
          height={100}
          className="rounded-full"
          priority
        />
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-xl">{user.username}</h1>
          <p>{user.email}</p>
        </div>
      </div>
      <h2 className="font-bold text-xl mb-5">Thêm khóa học</h2>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center gap-5">
          <Select
            onValueChange={(value) => setSelectCourse(value)}
            defaultValue={selectCourse}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn khóa học" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course}>
                  {course.title}
                  <strong className="ml-5 text-secondary">
                    {formatThoundsand(course.price)} VNĐ
                  </strong>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <NumericFormat
              valueIsNumericString
              thousandSeparator
              className={cn(
                "flex h-10 file:border-0 file:bg-transparent file:text-sm file:font-medium   focus-primary form-styles w-40"
              )}
              defaultValue={discount as any}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <Button
            type="button"
            className={
              "size-10 rounded flex items-center justify-center bg-primary text-white p-1 flex-shrink-0"
            }
            onClick={handleAddCourseToUser}
            isLoading={isSubmitting}
          >
            {IconPlus}
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {user.courses.map((course: any, index: number) => (
            <div
              className="flex items-center justify-between p-3 rounded bg-white text-sm dark:bg-grayDarker gap-3"
              key={index}
            >
              <h3 className="font-semibold">
                {course.title}
                <strong className="text-secondary ml-5">
                  {formatThoundsand(course.price)} VNĐ
                </strong>
              </h3>
              <Button
                type="button"
                className="flex w-8 h-8 p-0 items-center gap-2 rounded bg-red-100 text-red-500 font-semibold hover:opacity-85 flex-shrink-0"
                onClick={() =>
                  handleRemoveCourseFromUser(course._id.toString())
                }
              >
                <IconDelete />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <h2 className="font-bold text-xl mb-5">Phân quyền</h2>
      <div className="mb-5">
        <div className="flex flex-wrap gap-5">
          {Object.values(userPermissions).map((key) => (
            <div
              className="flex items-center gap-2 capitalize font-medium text-sm"
              key={key}
            >
              <span>{key}</span>
              <Checkbox
                defaultValue={userPermissions[key as TUserPermission]}
                className="border-gray-500 dark:border-white"
                checked={selectPermissions.includes(key)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectPermissions([...selectPermissions, key]);
                  } else {
                    setSelectPermissions(
                      selectPermissions.filter(
                        (permission) => permission !== key
                      )
                    );
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <h2 className="font-bold text-xl mb-5">Vai trò</h2>
      <div className="flex items-center gap-5">
        <div className="w-40">
          <Select
            onValueChange={(value) => setUserRole(value)}
            defaultValue={userRole}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Role.USER}>Thành viên</SelectItem>
              <SelectItem value={Role.EXPERT}>Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleUpdatePermissions}
          className={cn(primaryButtonClassName, "w-fit flex")}
          isLoading={isUpdatePermissions}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default UserUpdateCourse;
