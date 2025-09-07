"use client";
import {
  addCourseToUser,
  removeCourseFromUser,
} from "@/lib/actions/user.action";
import { membershipPlans } from "@/shared/constants/user.constants";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { IconDelete } from "../icons";
import { Button } from "../ui/button";
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
        title: "Bạn đã chắc chắn chưa ?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        icon: "warning",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const discountValue = 999_000;
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

  const [selectCourse, setSelectCourse] = useState<any>(null);
  const planDetails = membershipPlans.find(
    (membership) => membership.plan === user?.plan
  );

  return (
    <div className="l-container">
      <div className="mb-5 flex flex-col gap-3 pb-5 border-b border-dashed border-gray-400 dark:border-grayDarker">
        <img
          src={user.avatar}
          alt={user.username}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="flex items-center gap-2">
          {planDetails && (
            <Image
              src={planDetails.icon}
              width={60}
              height={60}
              alt={planDetails.plan}
            />
          )}
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-xl">{user.username}</h1>
            <p>{user.email}</p>
          </div>
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
            <SelectContent className="h-[200px] lg:h-auto overflow-y-auto">
              {courses.map((course) => (
                <SelectItem key={course._id} value={course}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            className={
              "size-12 rounded flex items-center justify-center bg-primary text-white p-1 flex-shrink-0"
            }
            onClick={handleAddCourseToUser}
            isLoading={isSubmitting}
          >
            {IconPlus}
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {user.courses.map((course: any, index: number) => (
            <div
              className="flex items-center justify-between p-2 rounded-full bg-white text-xs dark:bg-grayDarker gap-3 border borderDarkMode"
              key={index}
            >
              <h3 className="font-semibold">{course.title}</h3>
              <Button
                type="button"
                className="p-0 hover:text-red-500 size-4"
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
    </div>
  );
};

export default UserUpdateCourse;
