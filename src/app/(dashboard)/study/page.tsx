import { getUserById } from "@/lib/actions/user.action";
import { StudyPageContainer } from "@/modules/course/pages/study-page/study-page-container";
import { fetchUserCoursesContinue } from "@/modules/user/actions";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";

export interface StudyPageRootProps {}

export default async function StudyPageRoot(_props: StudyPageRootProps) {
  const { userId } = auth();
  const mongoUser = (await getUserById({
    userId: userId || "",
  })) as UserItemData;

  if (!mongoUser) return null;

  const getCachedFetchUserCoursesContinue = unstable_cache(
    fetchUserCoursesContinue,
    [QUERY_KEYS.FETCH_COURSES_CONTINUE, `${mongoUser?.clerkId}`],
    { revalidate: 1800 }
  );

  const data = await getCachedFetchUserCoursesContinue({
    userId: mongoUser?.clerkId,
    limit: 20,
  });
  const courses = data?.courses || [];
  const lessons = data?.lessons || [];
  return (
    <StudyPageContainer isLoading={!data} courses={courses} lessons={lessons} />
  );
}
