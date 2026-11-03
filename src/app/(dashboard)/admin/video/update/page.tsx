import { fetchVideoUpdateData } from "@/modules/course/actions";
import { VideoUpdatePage } from "@/modules/course/pages";
import { NotFoundState } from "@/shared/components/not-found";

interface VideoUpdateRouteProps {
  searchParams: {
    slug: string;
  };
}

export default async function VideoUpdateRoute({
  searchParams,
}: VideoUpdateRouteProps) {
  // Chỉ trả dữ liệu cho admin, nên không có dữ liệu là không có quyền hoặc không có video
  const videoData = await fetchVideoUpdateData(searchParams.slug);

  if (!videoData) return <NotFoundState />;

  return <VideoUpdatePage data={videoData} />;
}
