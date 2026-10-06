import {
  UserPersonalPage,
  UserPersonalPageSkeleton,
} from "@/modules/user/pages/personal-page";
import { getPublicProfile } from "@/modules/user/services/public-profile.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface UserPersonalPageRootProps {
  params: { username: string };
}

export default async function UserPersonalPageRoot({
  params,
}: UserPersonalPageRootProps) {
  // Tra user trước Suspense: không có thì trả 404 thật, không phải 200 kèm giao
  // diện 404. Trang bên dưới dùng lại kết quả này (cache theo request)
  const profile = await getPublicProfile(params.username);

  if (profile === null) notFound();

  return (
    <Suspense fallback={<UserPersonalPageSkeleton />}>
      <UserPersonalPage username={params.username} />
    </Suspense>
  );
}
