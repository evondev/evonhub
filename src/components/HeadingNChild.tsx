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
      <h1 className="text-2xl lg:text-3xl font-extrabold mb-8">{title}</h1>
      <div className="grid xl:grid-cols-3 2xl:grid-cols-4 xl:gap-8 courseSlider">
        {children}
      </div>
    </>
  );
};

export default HeadingNChild;
