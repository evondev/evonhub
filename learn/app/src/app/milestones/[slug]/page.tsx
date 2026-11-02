import { milestoneCatalog } from "@/features/lessons/constants/milestones";
import MilestonePage from "@/features/lessons/pages/milestone-page";

export function generateStaticParams() {
  return milestoneCatalog.map((milestone) => ({ slug: milestone.slug }));
}

// Không await params ở đây: để MilestonePage đọc nó bên trong <Suspense>, khung trang hiện ngay.
export default function Page({ params }: PageProps<"/milestones/[slug]">) {
  const milestoneSlugPromise = params.then((routeParams) => routeParams.slug);

  return <MilestonePage milestoneSlugPromise={milestoneSlugPromise} />;
}
