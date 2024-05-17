"use client";
import { permissions, primaryButtonClassName } from "@/constants";
import {
  addCourseToUser,
  removeCourseFromUser,
  updateUserByUsername,
} from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
      const res = await addCourseToUser({
        userId: user.clerkId,
        courseId: selectCourse,
        path: `/admin/user/update?username=${user.username}`,
      });
      if (res?.type === "error") {
        return toast.error(res.message);
      }
      toast.success("Thêm khóa học thành công");
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
        },
      });
      toast.success("Cập nhật quyền thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatePermissions(false);
    }
  };
  const [selectCourse, setSelectCourse] = useState("");
  const [selectPermissions, setSelectPermissions] = useState<string[]>(
    user.permissions || []
  );
  return (
    <>
      <h2 className="font-bold text-xl mb-5">Thêm khóa học</h2>
      <div className="grid grid-cols-2 gap-8 items-start mb-8">
        <div className="flex items-center gap-5">
          <Select onValueChange={(value) => setSelectCourse(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn khóa học" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id.toString()}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            className={primaryButtonClassName}
            onClick={handleAddCourseToUser}
            isLoading={isSubmitting}
          >
            Thêm khóa học
          </Button>
        </div>
        <div className="flex flex-col">
          {user.courses.map((course: any, index: number) => (
            <div
              className="flex items-center justify-between mb-5 pb-5 border-b border-dashed last:border-0 last:pb-0 last:mb-0"
              key={index}
            >
              <h3 className="font-semibold">{course.title}</h3>
              <Button
                className="h-12 px-5 flex items-center justify-center underline font-semibold text-base"
                onClick={() =>
                  handleRemoveCourseFromUser(course._id.toString())
                }
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      </div>
      <h2 className="font-bold text-xl mb-5">Phân quyền</h2>
      <div className="bg-white rounded-lg p-5 dark:bg-grayDarker mb-5">
        <div className="grid grid-cols-4 gap-5">
          {Object.keys(permissions).map((key) => (
            <div
              className="grid grid-cols-[200px,1fr] items-center gap-2 capitalize"
              key={key}
            >
              <span>{key}</span>
              <Checkbox
                defaultValue={permissions[key]}
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
      <Button
        onClick={handleUpdatePermissions}
        className={cn(primaryButtonClassName, "ml-auto w-fit flex")}
        isLoading={isUpdatePermissions}
      >
        Cập nhật
      </Button>
    </>
  );
};

export default UserUpdateCourse;
