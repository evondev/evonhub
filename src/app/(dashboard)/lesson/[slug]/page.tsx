const data = [
  {
    title: "Getting started",
    lessons: [
      {
        title: "Course Overview",
        url: "/lesson/course-overview",
        type: "video",
        duration: 180,
      },
    ],
  },
];
const Lesson = () => {
  return (
    <div className="grid grid-cols-[2fr,1fr] gap-5 items-start">
      <div>
        <div className="h-[400px] bg-gray-200 rounded-lg mb-5"></div>
        <h1 className="font-bold text-2xl mb-5">Studzy - Course Detail</h1>
        <div className="lesson-content">
          <p className="mb-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Distinctio, nulla! Quos, earum nihil maiores saepe, repellat, est
            expedita veritatis unde culpa laborum perferendis rem explicabo quas
            quia itaque officiis accusantium!
          </p>
          <p className="mb-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Distinctio, nulla! Quos, earum nihil maiores saepe, repellat, est
            expedita veritatis unde culpa laborum perferendis rem explicabo quas
            quia itaque officiis accusantium!
          </p>
          <h2 className="font-semibold text-lg mb-10">
            {" "}
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </h2>
          <p>
            <code className="text-primary bg-primary bg-opacity-10 p-1 text-xs">
              header
            </code>
          </p>
        </div>
      </div>
      <div>
        <div className="accordion">
          <div className="flex items-center justify-between font-semibold p-3 rounded dark:bg-grayDarker bg-white mb-5">
            <h3>Getting started</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-3 rounded bg-white dark:bg-grayDarker text-sm hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
                  clipRule="evenodd"
                />
              </svg>
              <span>UIUX Example</span>
              <span className="ml-auto text-xs">3:25</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded bg-primary text-white text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
                  clipRule="evenodd"
                />
              </svg>
              <span>UIUX Example</span>
              <span className="ml-auto text-xs">3:25</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
