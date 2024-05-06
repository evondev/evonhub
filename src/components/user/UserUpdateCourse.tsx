"use client";
import { primaryButtonClassName } from "@/constants";
import { addCourseToUser } from "@/lib/actions/user.action";
import { updateUserSchema } from "@/utils/formSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
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
  const handleAddCourseToUser = async () => {
    try {
      const res = await addCourseToUser({
        userId: user.clerkId,
        courseId: selectCourse,
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
      <div className="flex items-center gap-10">
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
    </>
  );
};

export default UserUpdateCourse;
