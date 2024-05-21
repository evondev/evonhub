import React from "react";

const layout = ({
  player,
  rating,
  content,
  comment,
}: {
  player: React.ReactNode;
  rating: React.ReactNode;
  content: React.ReactNode;
  comment: React.ReactNode;
}) => {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 items-start transition-all"
      id="lesson-study"
    >
      <div>
        {player}
        {rating}
        {comment}
      </div>
      <div id="lesson-content-aside">{content}</div>
    </div>
  );
};

export default layout;
