"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IconPlay, IconStudy } from "../icons";
enum ETabs {
  LESSON = "LESSON",
  CONTENT = "CONTENT",
}
const tabClassName =
  "p-2 px-4 rounded-full flex items-center text-sm gap-2 text-gray-500 font-medium";
const tabList = [
  {
    id: ETabs.LESSON,
    label: "Bài học",
    icon: <IconPlay className="size-5"></IconPlay>,
  },
  {
    id: ETabs.CONTENT,
    label: "Nội dung",
    icon: <IconStudy className="size-5"></IconStudy>,
  },
];
const LessonStudy = ({
  content,
  children,
}: {
  content?: any;
  children?: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<ETabs>(ETabs.LESSON);
  const handleActiveTab = (tab: ETabs) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    const links = document.querySelectorAll(".lesson-content a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
    });
  }, [content]);
  return (
    <div className="bg-[#EEEFF1] relative dark:bg-grayDarkest h-full block lg:hidden">
      <div className="flex p-2 px-3 gap-2 border-b border-b-gray-200 dark:border-opacity-10 sticky top-0 left-0 right-0 h-14 bg-white dark:bg-grayDarker">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              tabClassName,
              activeTab === tab.id ? "text-white bg-primary" : ""
            )}
            onClick={() => handleActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="p-3 h-[calc(100%-56px)] overflow-y-auto">
        {activeTab === ETabs.LESSON ? (
          children
        ) : (
          <div className="bgDarkMode borderDarkMode p-3 rounded-lg">
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="lesson-content"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonStudy;
