"use client";
import { Input } from "@/components/ui/input";
import { baseButtonClassName, primaryButtonClassName } from "@/constants";
import { ILecture } from "@/database/lecture.model";
import { ILesson } from "@/database/lesson.model";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { useState } from "react";
import { useImmer } from "use-immer";

const CourseContent = ({
  data,
}: {
  data: {
    title: string;
    lecture: ILecture[];
  };
}) => {
  const [lectureList, setLectureList] = useImmer<
    {
      title: string;
      lesson: ILesson[];
    }[]
  >([]);
  const [isAddLecture, setIsAddLecture] = useState(true);
  const handleAddLecture = () => {
    setLectureList((draft) => {
      draft.push({ title: "", lesson: [] });
    });
  };
  const handleSaveLecture = (index: number) => {
    setLectureList((draft) => {
      draft[index].title = lectureList[index].title;
    });
  };
  const handleCancelLecture = (index: number) => {
    setLectureList((draft) => {
      draft.splice(index, 1);
    });
  };
  console.log(isAddLecture);
  return (
    <div>
      <h1 className="font-bold text-3xl mb-5">{data.title}</h1>
      {isAddLecture &&
        lectureList.map((lecture, index) => (
          <div
            className="p-5 rounded-lg border-2 dark:border-grayDarker mb-5"
            key={index}
          >
            <div className="flex items-center gap-3 mb-5">
              <h3 className="flex-shrink-0 font-bold">Tên chương:</h3>
              <Input
                placeholder="Nhập tiêu đề"
                onChange={debounce((e) => {
                  setLectureList((draft) => {
                    draft[index].title = e.target.value;
                  });
                }, 500)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className={primaryButtonClassName}
                onClick={() => handleSaveLecture(index)}
              >
                Thêm chương
              </button>
              <button
                className={cn(baseButtonClassName)}
                onClick={() => handleCancelLecture(index)}
              >
                Hủy
              </button>
            </div>
          </div>
        ))}
      {/* <div className="p-4 rounded-lg bg-white dark:bg-grayDarker flex items-center justify-between">
          <div className="flex items-center gap-2">
            <strong>Chương 1:</strong>
            <p>Chương 1: Thiết lập và tổng quan</p>
            <IconEdit />
            <IconDelete />
          </div>
          <div>
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
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </div>
        </div> */}
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
      <button
        className={cn(
          baseButtonClassName,
          "text-primary border border-primary gap-2"
        )}
        onClick={handleAddLecture}
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Thêm chương mới
      </button>
    </div>
  );
};

export default CourseContent;
