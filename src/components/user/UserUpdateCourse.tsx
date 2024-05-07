"use client";
import { primaryButtonClassName } from "@/constants";
import {
  addCourseToUser,
  removeCourseFromUser,
} from "@/lib/actions/user.action";
import { updateUserSchema } from "@/utils/formSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { IconDelete } from "../icons";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const UserUpdateCourse = ({ user, courses }: { user: any; courses: any[] }) => {
  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
    },
  });
  async function onSubmit(values: z.infer<typeof updateUserSchema>) {}
  const handleRemoveCourseFromUser = async (courseId: string) => {
    try {
      await removeCourseFromUser({
        userId: user.clerkId,
        courseId: courseId,
        path: `/admin/user/update?username=${user.username}`,
      });
      toast.success("Xóa khóa học thành công");
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddCourseToUser = async () => {
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
    }
  };
  const [selectCourse, setSelectCourse] = useState("");
  return (
    <>
      <div className="flex items-center gap-10 mb-10">
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
        >
          Thêm khóa học
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        {user.courses.map((course: any, index: number) => (
          <div className="flex items-center justify-between" key={index}>
            <h3 className="font-bold text-lg">{course.title}</h3>
            <Button
              className="size-12 flex items-center justify-center bg-white dark:bg-grayDarker flex-shrink-0"
              onClick={() => handleRemoveCourseFromUser(course._id.toString())}
            >
              <IconDelete />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserUpdateCourse;
