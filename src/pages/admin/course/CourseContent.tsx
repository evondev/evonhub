"use client";
import { IconDelete, IconEdit } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseButtonClassName, primaryButtonClassName } from "@/constants";
import { updateCourseWithLecture } from "@/lib/actions/course.action";
import { deleteLecture, updateLecture } from "@/lib/actions/lecture.action";
import {
  addLesson,
  deleteLesson,
  updateLesson,
} from "@/lib/actions/lesson.action";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { z } from "zod";
import CourseContentLesson from "./CourseContentLesson";
const formSchema = z.object({
  video: z.string().optional(),
  content: z.string().optional(),
});
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
      lessons: {
        _id: string;
        title: string;
        content: string;
        video: string;
        type: string;
      }[];
    }[];
  };
}) => {
  const [lectureList, setLectureList] = useState<
    {
      title: string;
      _id: string;
      lessons: {
        _id: string;
        title: string;
        content: string;
        video: string;
        type: string;
      }[];
    }[]
  >([]);
  const [lectureInput, setLectureInput] = useState("");
  const [lessonData, setLessonData] = useState({
    title: "",
    slug: "",
    content: "",
    video: "",
  });
  const [editLectureIndex, setEditLectureIndex] = useState(-1);
  const [editLessonIndex, setEditLessonIndex] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useImmer({
    lecture: false,
    lesson: false,
  });

  useEffect(() => {
    setLectureList(
      data.lecture.map((item) => ({
        title: item.title,
        _id: item._id,
        lessons: item.lessons,
      }))
    );
  }, [data]);
  const handleAddLesson = async (lectureId: string) => {
    try {
      await addLesson({
        title: "Tiêu đề bài học mới",
        slug: "tieu-de-bai-hoc-moi",
        content: "",
        video: "",
        type: "video",
        lectureId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteLesson = async (lessonId: string, lectureId: string) => {
    try {
      await deleteLesson({
        lessonId,
        lectureId,
        path: `/admin/course/content?slug=${data.slug}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddLecture = async () => {
    setIsSubmitting((draf) => {
      draf.lecture = true;
    });
    try {
      await updateCourseWithLecture({
        title: "Tiêu đề chương mới",
        courseId: data._id.toString(),
        order: lectureList.length,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting((draf) => {
        draf.lecture = false;
      });
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
    setIsSubmitting((draf) => {
      draf.lecture = true;
    });
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
      setIsSubmitting((draf) => {
        draf.lecture = false;
      });
      setLectureInput("");
      setEditLectureIndex(-1);
    }
  };
  const handleSaveLesson = async (lessonId: string) => {
    setIsSubmitting((draf) => {
      draf.lesson = true;
    });
    try {
      await updateLesson({
        lessonId,
        path: `/admin/course/content?slug=${data.slug}`,
        data: {
          ...lessonData,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting((draf) => {
        draf.lesson = false;
      });
      setEditLessonIndex(-1);
      setLessonData({
        ...lessonData,
        title: "",
      });
    }
  };
  const handleCancelLecture = (index: number) => {
    setEditLectureIndex(-1);
  };
  const handleCancelLesson = (index: number) => {
    setEditLessonIndex(-1);
  };

  return (
    <div>
      <h1 className="font-bold text-3xl mb-5">{data.title}</h1>
      {lectureList.map((lecture, index) => {
        const lessons = lecture.lessons;
        return (
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
              <>
                <div className="p-4 rounded-lg bg-white dark:bg-grayDarker flex items-center justify-between mb-5 font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <strong>Chương {index + 1}:</strong>
                    <p>{lecture.title}</p>
                    <button
                      className="size-5 flex items-center justify-center hover:text-blue-400"
                      onClick={() => setEditLectureIndex(index)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="size-5 hover:text-red-500 flex items-center justify-center"
                      onClick={() => handleDeleteLecture(lecture._id)}
                    >
                      <IconDelete />
                    </button>
                  </div>
                  <div></div>
                </div>
                <div className="flex flex-col gap-3 pl-10 mb-5">
                  {lessons.map((lesson) => (
                    <div key={lesson._id}>
                      {editLessonIndex === index ? (
                        <>
                          <div className="p-5 rounded-lg border bg-white dark:border-grayDarker my-5">
                            <div className="flex items-center gap-3 mb-5">
                              <h3 className="flex-shrink-0 font-bold">
                                Tên bài học:
                              </h3>
                              <Input
                                placeholder="Nhập tiêu đề"
                                className="font-semibold border-gray-200"
                                defaultValue={lesson.title}
                                onChange={debounce(
                                  (e) =>
                                    setLessonData({
                                      ...lessonData,
                                      title: e.target.value,
                                    }),
                                  500
                                )}
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                className={primaryButtonClassName}
                                onClick={() => handleSaveLesson(lesson._id)}
                              >
                                Cập nhật
                              </button>
                              <button
                                className={cn(baseButtonClassName)}
                                onClick={() => handleCancelLesson(index)}
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          key={lesson._id}
                        >
                          <AccordionItem value={lesson.title}>
                            <AccordionTrigger>
                              <div className="flex items-center gap-3 text-sm font-medium">
                                <div>{lesson.title}</div>
                                <button
                                  className="size-5 flex items-center justify-center hover:text-blue-400"
                                  onClick={() => setEditLessonIndex(index)}
                                >
                                  <IconEdit />
                                </button>
                                <button
                                  className="size-5 hover:text-red-500 flex items-center justify-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLesson(lesson._id, lecture._id);
                                  }}
                                >
                                  <IconDelete />
                                </button>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-white rounded-lg mt-5">
                              <CourseContentLesson
                                lessonId={lesson._id}
                                lesson={lesson}
                                slug={data.slug}
                              ></CourseContentLesson>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  ))}
                  {editLessonIndex === -1 && (
                    <Button
                      className={cn(
                        baseButtonClassName,
                        "w-[140px] border border-current dark:hover:border-current hover:text-primary ml-auto block h-10 my-5 dark:border-grayDarker"
                      )}
                      onClick={() => handleAddLesson(lecture._id)}
                      isLoading={isSubmitting.lesson}
                    >
                      Thêm bài học
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}

      {editLectureIndex === -1 && editLessonIndex === -1 && (
        <Button
          className={cn(
            baseButtonClassName,
            "w-[160px] border border-current hover:text-primary dark:hover:border-current dark:border-grayDarker"
          )}
          onClick={handleAddLecture}
          isLoading={isSubmitting.lecture}
        >
          Thêm chương mới
        </Button>
      )}
    </div>
  );
};

export default CourseContent;
