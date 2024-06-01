import React from "react";

export default function Layout({
  general,
  order,
}: {
  general: React.ReactNode;
  order: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:gap-8 l-container">
      {general}
      {order}
    </div>
  );
}
