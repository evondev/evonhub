"use client";
import { IconCube, IconDelete, IconEdit, IconPlay } from "@/components/icons";
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
import { convertSlug } from "@/utils";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useImmer } from "use-immer";
import LessonItemUpdate from "../lesson/LessonItemUpdate";

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
        slug: string;
        order: number;
        duration: number;
      }[];
    }[];
  };
}) => {
  const commonButtonClassName = cn(
    baseButtonClassName,
    "w-[140px] ml-auto mt-5 border border-gray-300 bg-gray-100 dark:border-opacity-10 dark:bg-grayDarkest hover:border-gray-100"
  );
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
        slug: string;
        order: number;
        duration: number;
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
  const [editLectureIndex, setEditLectureIndex] = useState("");
  const [editLessonIndex, setEditLessonIndex] = useState("");
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
        slug:
          "tieu-de-bai-hoc-moi" +
          (lectureList.find((item) => item._id === lectureId)?.lessons.length ||
            0),
        content: "",
        video: "",
        type: "video",
        order:
          lectureList.find((item) => item._id === lectureId)?.lessons.length ||
          0,
        lectureId,
        courseId: data._id.toString(),
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bài học");
      console.log(error);
    }
  };
  const handleDeleteLesson = async (lessonId: string, lectureId: string) => {
    try {
      Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc muốn xóa bài học này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteLesson({
            lessonId,
            lectureId,
            path: `/admin/course/content?slug=${data.slug}`,
          });
        }
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
      toast.error("Có lỗi xảy ra khi thêm chương mới");
      console.log(error);
    } finally {
      setIsSubmitting((draf) => {
        draf.lecture = false;
      });
    }
  };
  const handleDeleteLecture = async (lectureId: string) => {
    try {
      Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc muốn xóa chương này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteLecture({
            lectureId,
            courseId: data._id,
            path: `/admin/course/content?slug=${data.slug}`,
          });
        }
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
          title: lectureInput || lectureList[index].title,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting((draf) => {
        draf.lecture = false;
      });
      setLectureInput("");
      setEditLectureIndex("");
    }
  };
  const handleSaveLesson = async (
    lessonId: string,
    lesson: {
      title: string;
      content: string;
      video: string;
      type: string;
      slug: string;
    }
  ) => {
    setIsSubmitting((draf) => {
      draf.lesson = true;
    });
    try {
      await updateLesson({
        lessonId,
        path: `/admin/course/content?slug=${data.slug}`,
        data: {
          title: lessonData.title || lesson.title,
          slug: convertSlug(lessonData.title || lesson.title),
          courseId: data._id as any,
        },
      });
      toast.success("Bài học đã được cập nhật thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting((draf) => {
        draf.lesson = false;
      });
      setEditLessonIndex("");
      setLessonData({
        ...lessonData,
        title: "",
      });
    }
  };
  const handleCancelLecture = (index: number) => {
    setEditLectureIndex("");
  };
  const handleCancelLesson = (index: number) => {
    setEditLessonIndex("");
  };

  return (
    <div className="hidden lg:block">
      <h1 className="font-bold text-3xl mb-8">{data.title}</h1>
      {lectureList.map((lecture, index) => {
        const lessons = lecture.lessons;
        return (
          <div key={lecture.title} className="max-w-[1024px]">
            {editLectureIndex === lecture._id ? (
              <>
                <div className="p-5 rounded-lg border bg-white dark:border-grayDarker my-5 dark:bg-grayDarker">
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="flex-shrink-0 font-bold">Tên chương:</h3>
                    <Input
                      placeholder="Nhập tiêu đề"
                      className="font-semibold border-gray-200 dark:border-grayDarker dark:bg-grayDarkest"
                      defaultValue={lecture.title}
                      onChange={debounce(
                        (e) => setLectureInput(e.target.value),
                        500
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className={cn(primaryButtonClassName, "h-10")}
                      onClick={() => handleSaveLecture(index)}
                      isLoading={isSubmitting.lecture}
                    >
                      Cập nhật
                    </Button>
                    <button
                      className={cn(baseButtonClassName, "h-10")}
                      onClick={() => handleCancelLecture(index)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  key={lecture._id}
                >
                  <AccordionItem value={lecture.title}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2 font-semibold">
                        <IconCube />
                        <strong>Chương {index + 1}:</strong>
                        <p>{lecture.title}</p>
                        <button
                          className="size-5 flex items-center justify-center hover:text-blue-400"
                          onClick={() => setEditLectureIndex(lecture._id)}
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
                    </AccordionTrigger>
                    <AccordionContent className="bg-transparent">
                      <div className="flex flex-col gap-3 pl-10 mb-5">
                        {lessons.map((lesson, idx) => (
                          <div key={lesson._id}>
                            {editLessonIndex === lesson._id ? (
                              <>
                                <div className="p-5 rounded-lg border bg-white dark:border-grayDarker my-5 dark:bg-grayDarker">
                                  <div className="flex items-center gap-3 mb-5">
                                    <h3 className="flex-shrink-0 font-bold">
                                      Tên bài học:
                                    </h3>
                                    <Input
                                      placeholder="Nhập tiêu đề"
                                      className="font-semibold border-gray-200 dark:border-grayDarker dark:bg-grayDarkest"
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
                                    <Button
                                      className={cn(
                                        primaryButtonClassName,
                                        "h-10"
                                      )}
                                      onClick={() =>
                                        handleSaveLesson(lesson._id, lesson)
                                      }
                                      isLoading={isSubmitting.lesson}
                                    >
                                      Cập nhật
                                    </Button>
                                    <button
                                      className={cn(
                                        baseButtonClassName,
                                        "h-10"
                                      )}
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
                              >
                                <AccordionItem value={lesson._id}>
                                  <AccordionTrigger>
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                      <div className="flex items-center gap-1">
                                        <IconPlay />
                                        <div>{lesson.title}</div>
                                      </div>
                                      <span
                                        className="size-5 flex items-center justify-center hover:text-blue-400"
                                        onClick={() =>
                                          setEditLessonIndex(lesson._id)
                                        }
                                      >
                                        <IconEdit />
                                      </span>
                                      <span
                                        className="size-5 hover:text-red-500 flex items-center justify-center"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteLesson(
                                            lesson._id,
                                            lecture._id
                                          );
                                        }}
                                      >
                                        <IconDelete />
                                      </span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="bgDarkMode rounded-lg mt-5 p-5">
                                    <LessonItemUpdate
                                      lessonId={lesson._id}
                                      lesson={lesson}
                                      slug={data.slug}
                                      course={{
                                        id: data._id,
                                        slug: data.slug,
                                      }}
                                    ></LessonItemUpdate>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )}
                          </div>
                        ))}
                        {editLessonIndex === "" && (
                          <Button
                            className={commonButtonClassName}
                            onClick={() => handleAddLesson(lecture._id)}
                            isLoading={isSubmitting.lesson}
                          >
                            Thêm bài học
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
          </div>
        );
      })}

      {editLectureIndex === "" && editLessonIndex === "" && (
        <Button
          className={commonButtonClassName}
          onClick={handleAddLecture}
          isLoading={isSubmitting.lecture}
        >
          Thêm chương
        </Button>
      )}
    </div>
  );
};

export default CourseContent;
