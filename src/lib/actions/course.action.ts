"use server";
import Course, { ICourse } from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import User from "@/database/user.model";
import { CourseParams, CreateCourseParams, UpdateCourseParams } from "@/types";
import { ECourseStatus, Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function createCourse({
  title,
  slug,
  path,
  author,
}: CreateCourseParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (findUser && ![Role.ADMIN, Role.EXPERT].includes(findUser?.role))
      return undefined;
    const allCourse = await Course.find();
    const existSlug = allCourse.some((item) => item.slug === slug);
    if (existSlug) {
      return {
        type: "error",
        message: "Đường dẫn khóa học đã tồn tại!",
      };
    }
    await Course.create({
      title,
      slug,
      path,
      _destroy: false,
      author: findUser?._id,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function updateCourse({
  slug,
  updateData,
  path,
  courseSlug,
}: UpdateCourseParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (findUser && ![Role.ADMIN, Role.EXPERT].includes(findUser?.role))
      return undefined;
    const allCourse = await Course.find();
    const existCourse = allCourse.some(
      (item) => item.slug === slug && item.slug !== courseSlug
    );
    if (existCourse) {
      return {
        type: "error",
        message: "Đường dẫn này đã tồn tại!",
      };
    }

    if (findUser?.role !== Role.ADMIN) {
      delete updateData.status;
    }

    await Course.findOneAndUpdate({ slug: courseSlug }, updateData, {
      new: true,
    });

    revalidatePath(path || `/admin/course/update?slug=${slug}`);
  } catch (error) {
    console.log("error:", error);
  }
}
export async function getCourseBySlugUser(
  slug: string
): Promise<ICourse | undefined> {
  try {
    connectToDatabase();
    const { userId } = auth();
    if (!userId) return undefined;
    const findUser = await User.findOne({ clerkId: userId });
    if (findUser && ![Role.ADMIN, Role.EXPERT].includes(findUser?.role))
      return undefined;
    let searchQuery: any = {};
    searchQuery.slug = slug;
    const course = await Course.findOne(searchQuery).populate({
      path: "lecture",
      populate: {
        path: "lessons",
        model: Lesson,
      },
    });
    if (
      findUser?._id.toString() !== course?.author.toString() &&
      findUser?.role !== Role.ADMIN
    ) {
      return undefined;
    }
    return course;
  } catch (error) {
    console.log("error:", error);
  }
}
export async function getCourseBySlug(
  slug: string
): Promise<CourseParams | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    searchQuery.slug = slug;
    const course = await Course.findOne(searchQuery).select(
      "title info desc level views intro image price salePrice status slug cta ctaLink seoKeywords free author"
    );

    return course;
  } catch (error) {
    console.log("error:", error);
  }
}

export async function getAllCoursesUser(
  params: any
): Promise<ICourse[] | undefined> {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (
      findUser &&
      findUser?.role &&
      ![Role.ADMIN, Role.EXPERT].includes(findUser?.role)
    )
      return undefined;
    let searchQuery: any = {};
    if (params.status) {
      searchQuery.status = params.status;
    }
    if (findUser && findUser?.role !== Role.ADMIN) {
      searchQuery.author = findUser._id;
    }
    const courses = await Course.find(searchQuery).select(
      "title slug image createdAt status price _id free rating views"
    );
    return courses;
  } catch (error) {}
}
export async function getAllCourses(
  params: any
): Promise<ICourse[] | undefined> {
  try {
    connectToDatabase();
    let searchQuery: any = {};
    if (params.status) {
      searchQuery.status = params.status;
    }
    const courses = await Course.find(searchQuery)
      .select("title slug image level rating price salePrice views free")
      .sort({ createdAt: -1 });
    return courses;
  } catch (error) {}
}
export async function deleteCourse(slug: string) {
  try {
    connectToDatabase();
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (![Role.ADMIN].includes(findUser?.role)) return undefined;
    await Course.findOneAndUpdate(
      { slug },
      {
        status: ECourseStatus.PENDING,
      }
    );
    revalidatePath("/admin/course/manage");
  } catch (error) {}
}
export async function updateCourseWithLecture(params: {
  title: string;
  courseId: string;
  order: number;
}) {
  try {
    connectToDatabase();
    const course = await Course.findById(params.courseId);

    if (!course) {
      throw new Error("Không tìm thấy khóa học");
    }
    const newLecture = new Lecture({
      ...params,
      _destroy: false,
    });
    await newLecture.save();
    course.lecture.push(newLecture._id);
    await course.save();
    revalidatePath(`/admin/course/content?slug=${course.slug}`);
  } catch (error) {
    console.log(error);
  }
}
export async function updateCourseViews(slug: string) {
  try {
    connectToDatabase();
    await Course.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
  } catch (error) {
    console.log(error);
  }
}
export async function getFreeCourse(slug: string) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (!findUser)
      return {
        type: "error",
        message: "Vui lòng đăng nhập để đăng ký khóa học",
      };
    const findCourse = await Course.find({ slug, free: true });
    if (!findCourse)
      return {
        type: "error",
        message: "Khóa học không tồn tại",
      };
    if (findUser.courses.includes(findCourse[0]._id)) {
      return {
        type: "error",
        message: "Bạn đã đăng ký khóa học này rồi",
      };
    }
    findUser.courses.push(findCourse[0]._id);
    await findUser.save();

    return {
      type: "success",
      message: "Đăng ký khóa học thành công",
    };
  } catch (error) {
    console.log(error);
  }
}
