"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
const tabs = [
  {
    title: "My courses",
    content: "",
  },
  {
    title: "Recommend",
    content: "",
  },
] as const;
type TActiveTab = (typeof tabs)[number]["title"];
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TActiveTab>("My courses");
  return (
    <div>
      <div className="flex p-2 rounded-lg bg-white gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.title}
            className={twMerge(
              "font-medium py-2 px-4 text-sm rounded",
              tab.title === activeTab ? "bg-gray-100 font-semibold" : ""
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
