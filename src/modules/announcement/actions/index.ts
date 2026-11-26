"use server";

import CourseModel from "@/modules/course/models";
import LessonModel from "@/modules/lesson/models";
import UserModel from "@/modules/user/models";
import { FEATURE_ANNOUNCEMENT_ID } from "@/shared/constants/announcement.constants";
import {
  CourseStatus,
  CourseType,
} from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import {
  getYoutubeThumbnail,
  getYoutubeWatchUrl,
} from "@/shared/utils/video-embed.utils";
import { ANNOUNCED_VIDEO_SLUG } from "../constants";
import type {
  AnnouncedVideo,
  AnnouncedVideoLesson,
  AnnouncedVideoRow,
} from "../types";

/**
 * Ghi là người đang đăng nhập đã thấy đợt thông báo. Chỉ nhận mã đợt đang chạy,
 * để client không nhét chuỗi tuỳ ý vào bản ghi user
 */
export async function markFeatureAnnouncementSeen(
  announcementId: string,
): Promise<boolean> {
  try {
    if (announcementId !== FEATURE_ANNOUNCEMENT_ID) return false;

    const currentUser = await getCurrentUser();

    if (!currentUser) return false;

    await connectToDatabase();
    await UserModel.updateOne(
      { _id: currentUser._id },
      { $addToSet: { seenAnnouncements: announcementId } },
    );

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

/**
 * Video đang giới thiệu trong hộp thông báo, kèm thời lượng và link YouTube của
 * bài. Video chưa duyệt, đã xoá hay không tìm thấy thì trả về null để hộp không bật
 */
export async function fetchAnnouncedVideo(): Promise<AnnouncedVideo | null> {
  try {
    await connectToDatabase();

    const video = await CourseModel.findOne({
      slug: ANNOUNCED_VIDEO_SLUG,
      type: CourseType.Video,
      status: CourseStatus.Approved,
      _destroy: false,
    })
      .select(
        "title slug image level rating price salePrice free isComingSoon createdAt studyCount",
      )
      .lean<AnnouncedVideoRow>();

    if (!video) return null;

    const lesson = await LessonModel.findOne({
      courseId: video._id,
      _destroy: false,
    })
      .select("duration iframe")
      .lean<AnnouncedVideoLesson>();

    const lessonIframe = lesson?.iframe || "";
    const announcedVideo = {
      ...video,
      // Chưa có ảnh bìa mà bài là link YouTube: lấy thumbnail của chính video
      image: video.image || getYoutubeThumbnail(lessonIframe),
      duration: lesson?.duration ?? 0,
      excerpt: "",
      youtubeUrl: getYoutubeWatchUrl(lessonIframe),
    };

    return parseData(announcedVideo);
  } catch (error) {
    console.log(error);

    return null;
  }
}
