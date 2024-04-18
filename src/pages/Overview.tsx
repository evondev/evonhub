const Overview = () => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white dark:bg-grayDark rounded-xl p-5">
          <h3 className="font-bold text-3xl">5</h3>
          <p className="text-sm text-gray70">Courses</p>
        </div>
        <div className="bg-white dark:bg-grayDark rounded-xl p-5">
          <h3 className="font-bold text-3xl">500</h3>
          <p className="text-sm text-gray70">Active users</p>
        </div>
        <div className="bg-white dark:bg-grayDark rounded-xl p-5">
          <h3 className="font-bold text-3xl">50000</h3>
          <p className="text-sm text-gray70">Views</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
