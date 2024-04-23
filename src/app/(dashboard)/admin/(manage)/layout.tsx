import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  // const { userId: clerkId } = auth();
  let mongoUser: any;
  // if (clerkId) {
  //   mongoUser = await getUserById({
  //     userId: clerkId,
  //   });
  // }
  // if (mongoUser?.role !== "admin") return <PageNotFound></PageNotFound>;
  return <div>{children}</div>;
};

export default AdminLayout;
