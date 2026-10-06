import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { LucideIcon } from "lucide-react";

export type {
  CountByCourse,
  CourseProgress,
  FirstLessonLink,
  UserCoursesContinueData,
} from "./course-progress.types";

export interface FetchUsersProps {
  search?: string;
  limit: number;
  page: number;
  isPaid?: boolean;
  status?: UserStatus;
  role?: UserRole;
}

/** Dữ liệu trang hồ sơ: chỉ các trường trang này đọc hoặc sửa */
export interface ProfileData {
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  socials?: Partial<ProfileSocialFormValues>;
  bank?: Partial<ProfilePayoutFormValues>;
}

export interface ProfilePublicFormValues {
  name: string;
  username: string;
  bio: string;
}

export interface ProfileSocialFormValues {
  facebook: string;
  youtube: string;
  linkedin: string;
}

export interface ProfilePayoutFormValues {
  bankName: string;
  bankNumber: string;
  bankAccount: string;
  bankBranch: string;
}

export interface ProfileSocialField {
  name: keyof ProfileSocialFormValues;
  label: string;
  placeholder: string;
}

export interface ProfileSocialLinkItem {
  name: keyof ProfileSocialFormValues;
  label: string;
  icon: LucideIcon;
}

export interface ProfileSocialLink extends ProfileSocialLinkItem {
  url: string;
}

export interface ProfilePayoutField {
  name: keyof ProfilePayoutFormValues;
  label: string;
  hint?: string;
  inputMode?: "numeric" | "text";
}

export type ProfilePreviewState =
  "hoc-vien" | "chuyen-gia" | "chua-dien" | "dang-tai" | "loi";

export interface ProfilePreviewStateLink {
  state: ProfilePreviewState;
  label: string;
}

export interface ProfileAvatarTone {
  background: string;
  text: string;
}

export type UpdateMyProfileParams =
  | { section: "public"; values: ProfilePublicFormValues }
  | { section: "socials"; values: ProfileSocialFormValues }
  | { section: "payout"; values: ProfilePayoutFormValues };

/** Kết quả lưu một khối: lỗi theo ô thì hiện dưới ô, lỗi chung thì toast */
export interface ProfileSaveResult {
  isSuccess: boolean;
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
}
