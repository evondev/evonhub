import { describe, expect, it } from "vitest";
import { NotificationType } from "../constants/notification-type.constants";
import { NotificationItemData } from "../types";
import {
  getNotificationLink,
  getNotificationMessage,
  isNotificationUnread,
} from "./index";

function buildNotification(
  overrides: Partial<NotificationItemData>,
): NotificationItemData {
  return {
    _id: "notification-1",
    createdAt: "2026-10-06T08:00:00.000Z",
    ...overrides,
  };
}

describe("getNotificationLink", () => {
  it("mở bài học mới", () => {
    const notification = buildNotification({
      type: NotificationType.NewLesson,
      data: { courseSlug: "reactjs", lessonId: "lesson-1" },
    });

    expect(getNotificationLink(notification)).toBe(
      "/reactjs/lesson?id=lesson-1",
    );
  });

  it("mở đúng bình luận đã duyệt", () => {
    const notification = buildNotification({
      type: NotificationType.CommentApproved,
      data: { courseSlug: "reactjs", lessonId: "lesson-1", commentId: "c-1" },
    });

    expect(getNotificationLink(notification)).toBe(
      "/reactjs/lesson?id=lesson-1#c-1",
    );
  });

  it("đăng ký xong thì mở khu học của khóa", () => {
    const notification = buildNotification({
      type: NotificationType.CourseEnrolled,
      data: { courseSlug: "reactjs" },
    });

    expect(getNotificationLink(notification)).toBe("/study?khoa=reactjs");
  });

  it("thông báo cũ hoặc thiếu slug thì không có link", () => {
    expect(getNotificationLink(buildNotification({ content: "<b>x</b>" }))).toBe(
      undefined,
    );
    expect(
      getNotificationLink(
        buildNotification({
          type: NotificationType.NewLesson,
          data: { lessonId: "lesson-1" },
        }),
      ),
    ).toBe(undefined);
  });
});

describe("getNotificationMessage", () => {
  it("tô đậm tên khóa và tên bài", () => {
    const messageParts = getNotificationMessage(
      buildNotification({
        type: NotificationType.NewLesson,
        data: { courseTitle: "ReactJS", lessonTitle: "useEffect" },
      }),
    );

    expect(messageParts.map((part) => part.text).join("")).toBe(
      "Khóa học ReactJS vừa có bài học mới: useEffect",
    );
    expect(
      messageParts.filter((part) => part.isHighlight).map((part) => part.text),
    ).toEqual(["ReactJS", "useEffect"]);
  });

  it("giữ nguyên ký tự HTML trong tên, không thành thẻ", () => {
    const messageParts = getNotificationMessage(
      buildNotification({
        type: NotificationType.CourseEnrolled,
        data: { courseTitle: "<script>alert(1)</script>" },
      }),
    );

    expect(messageParts[1].text).toBe("<script>alert(1)</script>");
  });
});

describe("isNotificationUnread", () => {
  it("chưa xem lần nào thì là chưa đọc", () => {
    expect(isNotificationUnread("2026-10-06T08:00:00.000Z", null)).toBe(true);
  });

  it("chỉ thông báo mới hơn mốc mới là chưa đọc", () => {
    const seenAt = "2026-10-06T08:00:00.000Z";

    expect(isNotificationUnread("2026-10-06T08:00:00.000Z", seenAt)).toBe(false);
    expect(isNotificationUnread("2026-10-06T09:00:00.000Z", seenAt)).toBe(true);
  });
});
