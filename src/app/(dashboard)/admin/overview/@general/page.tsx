import { countOverview } from "@/lib/actions/general.action";
import { formatThoundsand } from "@/utils";

const GeneralPage = async () => {
  const data = await countOverview();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h2 className="font-extrabold text-2xl lg:text-3xl">Tổng quan</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          <BoxItem title="Khóa học" count={data?.course}></BoxItem>
          <BoxItem title="Học viên" count={data?.user}></BoxItem>
          <BoxItem title="Đơn hàng" count={data?.order}></BoxItem>
          <BoxItem
            title="Thu nhập"
            count={formatThoundsand(data?.income[0]?.total) || 0}
          ></BoxItem>
        </div>
      </div>
    </div>
  );
};
function BoxItem({
  title,
  count = 0,
}: {
  title: string;
  count?: number | string;
}) {
  return (
    <div className="p-5 rounded-lg bgDarkMode borderDarkMode">
      <h3 className="text-xl lg:text-3xl font-extrabold">{count}</h3>
      <h4 className="font-medium text-sm text-slate-500 mb-0.5">{title}</h4>
      {/* <span className="inline-flex py-0.5 px-2 mt-2 font-semibold rounded text-xs text-green-500 bg-green-100 dark:bg-green-900">
        10%
      </span> */}
    </div>
  );
}

export default GeneralPage;
