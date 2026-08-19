import { UserRole } from "@/shared/constants/user.constants";
import {
  clearCollections,
  connectMemoryDatabase,
  disconnectMemoryDatabase,
} from "@/test/setup-memory-db";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import CourseModel from "../models";
import { canManageCourse } from "./course-permission.service";

const authorId = new mongoose.Types.ObjectId();
const otherExpertId = new mongoose.Types.ObjectId();
let courseId: string;

beforeAll(async () => {
  await connectMemoryDatabase();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await disconnectMemoryDatabase();
});

async function createCourse() {
  const course = await CourseModel.create({
    title: "Khóa học Illustrator",
    slug: "khoa-hoc-illustrator",
    author: authorId,
  });

  courseId = course._id.toString();
}

describe("canManageCourse", () => {
  it("admin thao tác được với mọi khóa", async () => {
    await createCourse();

    expect(
      await canManageCourse({
        role: UserRole.Admin,
        userId: otherExpertId,
        courseId,
      })
    ).toBe(true);
  });

  it("expert thao tác được với khóa của chính mình", async () => {
    await createCourse();

    expect(
      await canManageCourse({
        role: UserRole.Expert,
        userId: authorId,
        courseId,
      })
    ).toBe(true);
  });

  it("expert không đụng được khóa của người khác", async () => {
    await createCourse();

    expect(
      await canManageCourse({
        role: UserRole.Expert,
        userId: otherExpertId,
        courseId,
      })
    ).toBe(false);
  });

  it("user thường thì không", async () => {
    await createCourse();

    expect(
      await canManageCourse({
        role: UserRole.User,
        userId: authorId,
        courseId,
      })
    ).toBe(false);
  });

  it("không có session thì không", async () => {
    await createCourse();

    expect(await canManageCourse({ courseId })).toBe(false);
  });
});
