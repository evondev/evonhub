import { ActivityType } from "@/shared/constants/activity.constants";
import { COURSE_DETAILS_PATH_PREFIX } from "@/shared/constants/common.constants";
import { FilterTabItem } from "@/shared/types";
import dayjs from "dayjs";
import {
  ACTIVITY_DELETED_LABELS,
  ACTIVITY_GROUPS,
  ACTIVITY_MANAGE_TABS,
  ACTIVITY_ONLINE_WINDOW_MS,
  ACTIVITY_STAFF_ROLE_LABELS,
} from "../constants";
import { ACTIVITY_TYPE_CONFIGS } from "../constants/activity-type.constants";
import {
  ActivityGroup,
  ActivityItemData,
  ActivityManageFilters,
  ActivityManageTab,
  ActivityManageTabCounts,
  ActivityRow,
  ActivityTypeCountGroup,
} from "../types";

/** Các loại việc thuộc một nhóm, để lọc theo tab */
export function getActivityTypesByGroup(group: ActivityGroup): ActivityType[] {
  return Object.values(ActivityType).filter(
    (type) => ACTIVITY_TYPE_CONFIGS[type].group === group,
  );
}

/** Tab là một nhóm việc; chuỗi lạ từ client thì không */
export function isActivityGroupTab(tab: unknown): tab is ActivityGroup {
  return ACTIVITY_GROUPS.includes(tab as ActivityGroup);
}

/** Tên đứng sau động từ: bài, chương hay khoá; ưu tiên tên hiện tại, rồi tên lúc ghi */
function getActivityTargetTitle(activity: ActivityItemData): string {
  const { target } = ACTIVITY_TYPE_CONFIGS[activity.type];

  if (target === "lesson") {
    return (
      activity.lesson?.title ||
      activity.targetTitle ||
      ACTIVITY_DELETED_LABELS.lesson
    );
  }

  if (target === "lecture") {
    return activity.targetTitle || ACTIVITY_DELETED_LABELS.lecture;
  }

  if (target === "course") {
    return (
      activity.course?.title ||
      activity.targetTitle ||
      ACTIVITY_DELETED_LABELS.course
    );
  }

  return "";
}

export function toActivityRow(activity: ActivityItemData): ActivityRow {
  return {
    id: activity._id,
    type: activity.type,
    userName: activity.user?.name || ACTIVITY_DELETED_LABELS.user,
    userEmail: activity.user?.email || "",
    userAvatar: activity.user?.avatar,
    userRoleLabel: activity.user
      ? ACTIVITY_STAFF_ROLE_LABELS[activity.user.role] || ""
      : "",
    targetTitle: getActivityTargetTitle(activity),
    courseTitle: activity.course?.title || ACTIVITY_DELETED_LABELS.course,
    courseHref: activity.course
      ? `${COURSE_DETAILS_PATH_PREFIX}${activity.course.slug}`
      : "",
    detail: activity.detail || "",
    startedAt: activity.createdAt,
    lastSeenAt: activity.lastSeenAt,
  };
}

/** Đếm theo loại việc (một $group) thành số của từng tab nhóm */
export function buildActivityTabCounts(
  typeCountGroups: ActivityTypeCountGroup[],
  onlineCount: number,
): ActivityManageTabCounts {
  const tabCounts: ActivityManageTabCounts = {
    all: 0,
    online: onlineCount,
    learning: 0,
    purchase: 0,
    account: 0,
    content: 0,
  };

  typeCountGroups.forEach((typeCountGroup) => {
    const typeConfig = ACTIVITY_TYPE_CONFIGS[typeCountGroup._id];

    tabCounts.all += typeCountGroup.count;
    if (typeConfig) tabCounts[typeConfig.group] += typeCountGroup.count;
  });

  return tabCounts;
}

export function buildActivityManageTabs(
  tabCounts?: ActivityManageTabCounts,
): FilterTabItem<ActivityManageTab>[] {
  return ACTIVITY_MANAGE_TABS.map((tab) => ({
    ...tab,
    count: tabCounts?.[tab.value],
  }));
}

/** Phiên học còn nhịp trong ACTIVITY_ONLINE_WINDOW_MS, cùng mốc với tab "Đang học" */
export function isActivityOnline(activity: ActivityRow): boolean {
  if (activity.type !== ActivityType.ViewLesson) return false;

  const elapsedMs = Date.now() - new Date(activity.lastSeenAt).getTime();

  return elapsedMs <= ACTIVITY_ONLINE_WINDOW_MS;
}

/** Thời gian một phiên học, từ lúc mở bài tới nhịp cuối: "học 1 giờ 5 phút" */
export function formatActivityDuration(activity: ActivityRow): string {
  const durationMinutes = dayjs(activity.lastSeenAt).diff(
    activity.startedAt,
    "minute",
  );
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (durationMinutes < 1) return "vừa mở bài";

  if (hours === 0) return `học ${minutes} phút`;

  if (minutes === 0) return `học ${hours} giờ`;

  return `học ${hours} giờ ${minutes} phút`;
}

/**
 * Trang xem trước lọc tại chỗ trên data giả, như server sẽ lọc. Tab "Đang học"
 * chỉ giữ dòng mới nhất của mỗi người (data giả đã xếp mới nhất trước)
 */
export function filterPreviewActivities(
  activities: ActivityRow[],
  filters: ActivityManageFilters,
  courseTitleById: Record<string, string>,
): ActivityRow[] {
  const keyword = filters.search.trim().toLowerCase();
  const courseTitle = courseTitleById[filters.courseId];
  const scopedActivities = activities.filter((activity) => {
    const isKeywordMatch =
      !keyword ||
      activity.userName.toLowerCase().includes(keyword) ||
      activity.userEmail.toLowerCase().includes(keyword);
    const isCourseMatch = !courseTitle || activity.courseTitle === courseTitle;

    return isKeywordMatch && isCourseMatch;
  });

  if (isActivityGroupTab(filters.tab)) {
    const group = filters.tab;

    return scopedActivities.filter(
      (activity) => ACTIVITY_TYPE_CONFIGS[activity.type].group === group,
    );
  }

  if (filters.tab !== "online") return scopedActivities;

  const seenEmails = new Set<string>();

  return scopedActivities.filter((activity) => {
    if (!isActivityOnline(activity) || seenEmails.has(activity.userEmail)) {
      return false;
    }

    seenEmails.add(activity.userEmail);

    return true;
  });
}

/** Số đếm từng tab của trang xem trước, tính trên data giả như server sẽ đếm */
export function countPreviewActivityTabs(
  activities: ActivityRow[],
  filters: ActivityManageFilters,
  courseTitleById: Record<string, string>,
): ActivityManageTabCounts {
  function countTab(tab: ActivityManageTab) {
    return filterPreviewActivities(
      activities,
      { ...filters, tab },
      courseTitleById,
    ).length;
  }

  return {
    all: countTab("all"),
    online: countTab("online"),
    learning: countTab("learning"),
    purchase: countTab("purchase"),
    account: countTab("account"),
    content: countTab("content"),
  };
}

export function formatActivityTime(date: string): string {
  return dayjs(date).format("HH:mm DD/MM/YYYY");
}
