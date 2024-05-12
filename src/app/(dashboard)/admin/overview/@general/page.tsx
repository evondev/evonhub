const GeneralPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h2 className="font-bold text-xl">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <BoxItem title="Khóa học" count={2}></BoxItem>
          <BoxItem title="Học viên" count={2000}></BoxItem>
          <BoxItem title="Bài học" count={200}></BoxItem>
          <BoxItem title="Lượt xem" count={20000}></BoxItem>
        </div>
      </div>
    </div>
  );
};
function BoxItem({ title, count }: { title: string; count: number }) {
  return (
    <div className="p-5 rounded-lg bg-white dark:bg-grayDarker">
      <h3 className="font-bold text-sm text-slate-500 mb-0.5">{title}</h3>
      <h4 className="text-xl font-extrabold">{count}</h4>
    </div>
  );
}

export default GeneralPage;
