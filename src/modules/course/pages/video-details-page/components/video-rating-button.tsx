"use client";

import { useUserContext } from "@/components/user-context";
import { RatingForm } from "@/shared/features/rating";

interface VideoRatingButtonProps {
  videoId: string;
  videoTitle: string;
}

/**
 * Nút đánh giá cạnh tiêu đề khối "Đánh giá". Khách chưa đăng nhập không thấy.
 * Video không có tiến độ học nên không tự mở hộp như trang học khóa
 */
export function VideoRatingButton({
  videoId,
  videoTitle,
}: VideoRatingButtonProps) {
  const { userInfo } = useUserContext();

  if (!userInfo?._id) return null;

  return (
    <RatingForm
      courseId={videoId}
      courseTitle={videoTitle}
      userId={userInfo._id}
      progressPercent={0}
      subjectLabel="video"
    />
  );
}
