import PageNotFound from "@/app/not-found";
import { getUserById } from "@/lib/actions/user.action";
import { fetchVideoBySlug } from "@/modules/micro/actions";
import UpdateMicroForm from "@/modules/micro/components/forms/update-micro-form";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { auth } from "@clerk/nextjs/server";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId: userId || "" });

  if (![UserRole.Admin].includes(mongoUser?.role))
    return <PageNotFound></PageNotFound>;

  const video = await fetchVideoBySlug(searchParams.slug);

  if (!video?.title) return <PageNotFound></PageNotFound>;

  return (
    <>
      <UpdateMicroForm
        data={parseData(video)}
        slug={searchParams.slug}
      ></UpdateMicroForm>
    </>
  );
};

export default page;
