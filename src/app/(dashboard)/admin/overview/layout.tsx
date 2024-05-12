import React from "react";

export default function Layout({
  general,
  reaction,
  member,
  comment,
  lesson,
}: {
  general: React.ReactNode;
  reaction: React.ReactNode;
  member: React.ReactNode;
  comment: React.ReactNode;
  lesson: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      {general}
      {reaction}
      <div className="grid grid-cols-2 gap-5">
        {member}
        {comment}
      </div>
      {lesson}
    </div>
  );
}
