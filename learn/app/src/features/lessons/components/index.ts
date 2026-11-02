// Barrel chỉ cho pages (server). Component client import lẫn nhau bằng đường dẫn tương đối,
// để không kéo LessonBody, MilestoneBody, LessonListContent (đọc file trên server) vào bundle trình duyệt.
export { default as LabTopBar } from "./lab-top-bar";
export { default as LessonBody } from "./lesson-body";
export { default as LessonListContent } from "./lesson-list-content";
export { default as MilestoneBody } from "./milestone-body";
