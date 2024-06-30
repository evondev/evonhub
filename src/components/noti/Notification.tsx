"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalStore } from "@/store";
import { getTimestamp } from "@/utils";

const IconNoti = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
    />
  </svg>
);
const Notification = ({ notifications }: { notifications: any[] }) => {
  const { currentUser } = useGlobalStore();
  return (
    <Popover>
      <PopoverTrigger className="size-10 flex items-center justify-center bg-white rounded-lg dark:bg-grayDarker border border-gray-200 dark:border-opacity-10">
        {IconNoti}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 shadow-sm dark:bg-grayDarker dark:border-opacity-10 dark:border-gray-200"
      >
        <div className="p-3 font-bold text-base border-b border-b-gray-200 dark:border-opacity-10">
          Thông báo
        </div>
        {notifications?.length > 0 && (
          <div className="p-3  max-h-[300px] overflow-y-auto">
            {notifications.map((el) => (
              <div
                className="flex items-baseline gap-3 text-sm font-medium pb-3 mb-3 border-b border-b-gray-100 border-dashed dark:border-opacity-10 last:mb-0 last:pb-0 last:border-b-0"
                key={el.title}
              >
                <span className="rounded-full size-2 bg-green-500 flex-shrink-0"></span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold">Hệ thống</h3>
                    <span className="block size-1 rounded-full bg-gray-600"></span>
                    <span className="text-slate-500 text-xs">
                      {getTimestamp(new Date(el.createdAt))}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: el.content,
                    }}
                    className="text-slate-600 dark:text-slate-200"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
