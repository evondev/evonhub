"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addLesson } from "@/lib/actions/lesson.action";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";

export interface CreateOutlinePageProps {}

function mergeLists() {
  const textArea1 = document.getElementById("textArea1") as HTMLTextAreaElement;
  const textArea2 = document.getElementById("textArea2") as HTMLTextAreaElement;

  if (!textArea1 || !textArea2) {
    toast.error("Không tìm thấy danh sách.");
    return;
  }

  const list1 = textArea1.value.split("\n").filter(Boolean);
  const list2 = textArea2.value.split("\n").filter(Boolean);

  if (list1.length !== list2.length) {
    toast.error("Hai danh sách không có cùng độ dài.");
    return;
  }
  if (list1.length === 0 || list2.length === 0) {
    toast.error("Danh sách không được để trống.");
    return;
  }

  const result = list1.map((title, index) => ({
    title: title.trim(),
    url: list2[index].trim(),
  }));

  toast.success("Đã tạo outline thành công.");
  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  textArea1.value = "";
  textArea2.value = "";
  return result;
}
function CreateOutlinePage(_props: CreateOutlinePageProps) {
  const [isLoading, starTransition] = useTransition();
  const handleMergeList = () => {
    starTransition(() => {
      mergeLists();
    });
  };
  const [courseId, setCourseId] = useState("");
  const [lectureId, setLectureId] = useState("");

  const handleAddLessonList = async (
    lessonList: {
      title: string;
      url: string;
    }[]
  ) => {
    if (lessonList.length === 0) return;
    try {
      lessonList.forEach(async (lesson, index) => {
        const order = index + 1;
        await addLesson({
          title: lesson.title,
          slug: slugify(lesson.title, {
            lower: true,
            locale: "vi",
            remove: /[*+~.()'"!:@,?_]/g,
          }),
          iframe: lesson.url,
          content: "",
          video: "",
          type: "video",
          order,
          lectureId,
          courseId,
        });
        toast.success("Bài học đã được thêm thành công");
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bài học");
      console.log(error);
    }
  };

  const handleCreateOutline = async () => {
    starTransition(() => {
      const lessonList = mergeLists();
      if (!lessonList) return;
      handleAddLessonList(lessonList);
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Label>ID khóa học</Label>
        <Input
          placeholder="ID khóa học"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>ID chương</Label>
        <Input
          placeholder="ID chương"
          value={lectureId}
          onChange={(e) => setLectureId(e.target.value)}
        />
      </div>
      <div className="flex gap-10">
        <Textarea
          id="textArea1"
          placeholder="Danh sách tiêu đề"
          className="h-[400px]"
        />
        <Textarea
          id="textArea2"
          placeholder="Danh sách link"
          className="h-[400px]"
        />
      </div>
      <Button
        className="bg-secondary text-white"
        onClick={handleCreateOutline}
        isLoading={isLoading}
      >
        Tạo outline
      </Button>
    </div>
  );
}

export default CreateOutlinePage;
