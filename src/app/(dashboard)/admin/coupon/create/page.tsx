import CouponCreate from "@/components/coupon/CouponCreate";
import { getAllCoursesUser } from "@/lib/actions/course.action";
import { ECourseStatus } from "@/types/enums";

const page = async () => {
  const allCoures = await getAllCoursesUser({
    status: ECourseStatus.APPROVED,
  });
  return (
    <>
      <CouponCreate
        courses={allCoures ? JSON.parse(JSON.stringify(allCoures)) : []}
      ></CouponCreate>
    </>
  );
};

export default page;
