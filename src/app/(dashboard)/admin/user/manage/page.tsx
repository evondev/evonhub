import UserManage from "@/components/user/UserManage";
import { getAllUsers } from "@/lib/actions/user.action";

const page = async ({
  searchParams,
}: {
  searchParams: {
    page: number;
    search: string;
    paidUser: boolean;
  };
}) => {
  const data = await getAllUsers({
    searchQuery: searchParams?.search,
    page: searchParams.page ? +searchParams.page : 1,
    paidUser: searchParams?.paidUser,
  });
  if (!data?.users) return null;
  return (
    <UserManage
      users={JSON.parse(JSON.stringify(data.users)) || []}
      count={data.total}
    />
  );
};

export default page;
