import { fetchUserCourses } from "@/modules/user/actions";
import { Heading } from "@/shared/components";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { StudyPageContainer } from "./study-page-container";

export interface StudyPageProps {}

export async function StudyPage(_props: StudyPageProps) {
  const { userId } = auth();
  const data = await fetchUserCourses(userId || "");
  return (
    <div>
      <Heading>
        Khu vực tu luyện
        <Image
          alt=""
          src="/meditation.png"
          width={32}
          height={32}
          className="dark:brightness-0 dark:invert"
        />
      </Heading>
      <StudyPageContainer
        courses={data?.courses}
        lessons={data?.lessons}
      ></StudyPageContainer>
    </div>
  );
}
