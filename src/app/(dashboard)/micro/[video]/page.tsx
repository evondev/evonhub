import { commonPath } from "@/constants";
import { StudyVideoPage } from "@/modules/micro/pages/study-video.page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export interface MicroVideoPageRootProps {
  params: {
    video: string;
  };
}

export default function MicroVideoPageRoot(_props: MicroVideoPageRootProps) {
  const slug = _props.params.video;
  const { userId } = auth();
  if (!userId) redirect(commonPath.LOGIN);
  return (
    <>
      <StudyVideoPage slug={slug} />
    </>
  );
}
