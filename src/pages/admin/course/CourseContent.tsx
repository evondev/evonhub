"use client";
import { IconDelete, IconEdit } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseButtonClassName, primaryButtonClassName } from "@/constants";
import { updateCourseWithLecture } from "@/lib/actions/course.action";
import { deleteLecture, updateLecture } from "@/lib/actions/lecture.action";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { useEffect, useState } from "react";

const CourseContent = ({
  data,
}: {
  data: {
    _id: string;
    title: string;
    slug: string;
    lecture: {
      _id: string;
      title: string;
    }[];
  };
}) => {
  const [lectureList, setLectureList] = useState<
    {
      title: string;
      _id: string;
    }[]
  >([]);
  const [isAddLecture, setIsAddLecture] = useState(false);
  const [lectureInput, setLectureInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLectureList(
      data.lecture.map((item) => ({ title: item.title, _id: item._id }))
    );
  }, [data]);

  const handleAddLecture = async () => {
    setIsSubmitting(true);
    try {
      await updateCourseWithLecture({
        title: "Tiêu đề chương mới",
        courseId: data._id.toString(),
        order: lectureList.length,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteLecture = async (lectureId: string) => {
    try {
      await deleteLecture({
        lectureId,
        courseId: data._id,
        path: `/admin/course/content?slug=${data.slug}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSaveLecture = async (index: number) => {
    setIsSubmitting(true);
    try {
      await updateLecture({
        lectureId: lectureList[index]._id,
        path: `/admin/course/content?slug=${data.slug}`,
        data: {
          title: lectureInput,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setLectureInput("");
      setEditLectureIndex(-1);
    }
  };
  const handleCancelLecture = (index: number) => {
    setEditLectureIndex(-1);
  };
  const [editLectureIndex, setEditLectureIndex] = useState(-1);
  return (
    <div>
      <h1 className="font-bold text-3xl mb-5">{data.title}</h1>
      {lectureList.map((lecture, index) => (
        <div key={lecture.title}>
          {editLectureIndex === index ? (
            <>
              <div className="p-5 rounded-lg border bg-white dark:border-grayDarker my-5">
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="flex-shrink-0 font-bold">Tên chương:</h3>
                  <Input
                    placeholder="Nhập tiêu đề"
                    className="font-semibold border-gray-200"
                    defaultValue={lecture.title}
                    onChange={debounce(
                      (e) => setLectureInput(e.target.value),
                      500
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className={primaryButtonClassName}
                    onClick={() => handleSaveLecture(index)}
                  >
                    Cập nhật
                  </button>
                  <button
                    className={cn(baseButtonClassName)}
                    onClick={() => handleCancelLecture(index)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-lg bg-white dark:bg-grayDarker flex items-center justify-between mb-5 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <strong>Chương {index + 1}:</strong>
                <p>{lecture.title}</p>
                <button
                  className="size-5 flex items-center justify-center text-blue-400"
                  onClick={() => setEditLectureIndex(index)}
                >
                  <IconEdit />
                </button>
                <button
                  className="size-5 text-red-500 flex items-center justify-center"
                  onClick={() => handleDeleteLecture(lecture._id)}
                >
                  <IconDelete />
                </button>
              </div>
              <div></div>
            </div>
          )}
        </div>
      ))}

      {/*  */}
      {/* <div className="p-5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <div>Bài 1: Cài đặt môi trường làm việc</div>
                  <IconEdit />
                  <IconDelete />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <Label>Đường dẫn video</Label>
                    <Input placeholder="Nhập đường dẫn video" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Nội dung</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div> */}
      {/* <div className="p-5 rounded-lg border-2 dark:border-grayDarker">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="flex-shrink-0 font-bold">Tên bài học:</h3>
            <Input placeholder="Nhập tiêu đề" />
          </div>
          <div className="flex justify-end">
            <button className={primaryButtonClassName}>Thêm</button>
            <button className={cn(baseButtonClassName)}>Hủy</button>
          </div>
        </div> */}
      {/* <button
          className={cn(
            baseButtonClassName,
            "text-primary border border-primary self-end gap-2 mt-5"
          )}
        >
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
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Thêm bài học
        </button> */}

      {/* <div className="p-5 rounded-lg border-2 dark:border-grayDarker">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="flex-shrink-0 font-bold">Tên chương:</h3>
            <Input placeholder="Nhập tiêu đề" />
          </div>
          <div className="flex justify-end">
            <button className={primaryButtonClassName}>Thêm chương</button>
            <button className={cn(baseButtonClassName)}>Hủy</button>
          </div>
        </div> */}
      <Button
        className={cn(
          baseButtonClassName,
          "w-[160px] border border-current text-primary"
        )}
        onClick={handleAddLecture}
        isLoading={isSubmitting}
      >
        Thêm chương mới
      </Button>
    </div>
  );
};

export default CourseContent;
