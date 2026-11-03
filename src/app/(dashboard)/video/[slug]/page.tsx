import { fetchVideoDetails } from "@/modules/course/actions";
import { VideoDetailsPage } from "@/modules/course/pages";
import { htmlToPlainText } from "@/shared/helpers/html.helper";
import { Metadata } from "next";

interface VideoDetailsRouteProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: VideoDetailsRouteProps): Promise<Metadata> {
  // fetchVideoDetails đọc qua cache(): page bên dưới dùng lại kết quả đọc video
  const videoDetails = await fetchVideoDetails(params.slug);
  const description = htmlToPlainText(videoDetails?.desc || "");

  return {
    title: videoDetails?.title,
    description,
    keywords: videoDetails?.seoKeywords,
    openGraph: {
      title: videoDetails?.title,
      description,
      images: [videoDetails?.image || "/cover.jpg"],
    },
  };
}

export default function VideoDetailsRoute({ params }: VideoDetailsRouteProps) {
  return <VideoDetailsPage slug={params.slug} />;
}
