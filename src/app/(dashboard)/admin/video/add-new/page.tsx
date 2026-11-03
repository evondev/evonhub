import { VideoAddPage } from "@/modules/course/pages";
import { NotFoundState } from "@/shared/components/not-found";
import { getCurrentAdmin } from "@/shared/libs/auth";

export default async function VideoAddRoute() {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) return <NotFoundState />;

  return <VideoAddPage />;
}
