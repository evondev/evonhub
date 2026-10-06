import { describe, expect, it } from "vitest";
import { NotificationType } from "../constants/notification-type.constants";
import { NotificationGroup, NotificationItemData } from "../types";
import {
  getNotificationLink,
  getNotificationMessage,
  groupNotifications,
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

function buildGroup(items: NotificationItemData[]): NotificationGroup {
  return { key: items[0]._id, latest: items[0], items, isUnread: true };
}

function joinMessage(group: NotificationGroup) {
  return getNotificationMessage(group)
    .map((part) => part.text)
    .join("");
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
    expect(
      getNotificationLink(buildNotification({ content: "<b>x</b>" })),
    ).toBe(undefined);
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
      buildGroup([
        buildNotification({
          type: NotificationType.NewLesson,
          data: { courseTitle: "ReactJS", lessonTitle: "useEffect" },
        }),
      ]),
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
      buildGroup([
        buildNotification({
          type: NotificationType.CourseEnrolled,
          data: { courseTitle: "<script>alert(1)</script>" },
        }),
      ]),
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

    expect(isNotificationUnread("2026-10-06T08:00:00.000Z", seenAt)).toBe(
      false,
    );
    expect(isNotificationUnread("2026-10-06T09:00:00.000Z", seenAt)).toBe(true);
  });
});

describe("trả lời bình luận", () => {
  function buildReply(id: string, actorName: string) {
    return buildNotification({
      _id: id,
      type: NotificationType.CommentReply,
      data: {
        courseSlug: "reactjs",
        lessonId: "lesson-1",
        lessonTitle: "useEffect",
        commentId: `reply-${id}`,
        parentCommentId: "parent-1",
        actorName,
      },
    });
  }

  it("mở đúng câu trả lời mới nhất", () => {
    expect(getNotificationLink(buildReply("1", "Lan"))).toBe(
      "/reactjs/lesson?id=lesson-1#reply-1",
    );
  });

  it("ghép tên người trả lời, không lặp tên", () => {
    expect(joinMessage(buildGroup([buildReply("1", "Lan")]))).toBe(
      "Lan đã trả lời bình luận của bạn tại bài học useEffect",
    );
    expect(
      joinMessage(
        buildGroup([
          buildReply("1", "Lan"),
          buildReply("2", "Lan"),
          buildReply("3", "Minh"),
        ]),
      ),
    ).toBe("Lan và Minh đã trả lời bình luận của bạn tại bài học useEffect");
    expect(
      joinMessage(
        buildGroup([
          buildReply("1", "Lan"),
          buildReply("2", "Minh"),
          buildReply("3", "Hoa"),
          buildReply("4", "Đức"),
        ]),
      ),
    ).toBe(
      "Lan, Minh và 2 người khác đã trả lời bình luận của bạn tại bài học useEffect",
    );
  });
});

describe("groupNotifications", () => {
  const seenAt = "2026-10-05T00:00:00.000Z";

  function buildNewLesson(id: string, courseSlug: string, createdAt: string) {
    return buildNotification({
      _id: id,
      createdAt,
      type: NotificationType.NewLesson,
      data: { courseSlug, courseTitle: courseSlug, lessonId: id },
    });
  }

  it("gộp bài học mới cùng khóa, giữ chỗ của cái mới nhất", () => {
    const groups = groupNotifications(
      [
        buildNewLesson("a", "react", "2026-10-06T03:00:00.000Z"),
        buildNewLesson("b", "js", "2026-10-06T02:00:00.000Z"),
        buildNewLesson("c", "react", "2026-10-06T01:00:00.000Z"),
      ],
      seenAt,
    );

    expect(groups.map((group) => group.latest._id)).toEqual(["a", "b"]);
    expect(groups[0].items).toHaveLength(2);
    expect(joinMessage(groups[0])).toBe("Khóa học react vừa có 2 bài học mới");
    expect(getNotificationLink(groups[0].latest)).toBe("/react/lesson?id=a");
  });

  it("không gộp chưa đọc với đã đọc", () => {
    const groups = groupNotifications(
      [
        buildNewLesson("a", "react", "2026-10-06T00:00:00.000Z"),
        buildNewLesson("b", "react", "2026-10-04T00:00:00.000Z"),
      ],
      seenAt,
    );

    expect(groups.map((group) => group.isUnread)).toEqual([true, false]);
  });

  it("không gộp đăng ký khóa học và thông báo cũ", () => {
    const groups = groupNotifications(
      [
        buildNotification({ _id: "x", content: "cũ" }),
        buildNotification({ _id: "y", content: "cũ" }),
        buildNotification({
          _id: "z",
          type: NotificationType.CourseEnrolled,
          data: { courseSlug: "react" },
        }),
        buildNotification({
          _id: "w",
          type: NotificationType.CourseEnrolled,
          data: { courseSlug: "react" },
        }),
      ],
      seenAt,
    );

    expect(groups).toHaveLength(4);
  });
});
