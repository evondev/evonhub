import React from "react";

const HeadingNChild = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-extrabold mb-8 flex items-baseline gap-1">
        <div className="w-10 h-2 bg-primary"></div>
        {title}
      </h1>
      <div className="grid xl:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 courseSlider">
        {children}
      </div>
    </>
  );
};

export default HeadingNChild;
