"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserContext } from "@/components/user-context";
import { useQueryNotificationsByUser } from "@/modules/notifications/services/data/query-notifications-by-user";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { getTimestamp } from "@/utils";
import { IconBell } from "../icons";

const Notification = () => {
  const { userInfo } = useUserContext();

  const { data: notifications } = useQueryNotificationsByUser({
    userId: userInfo?._id || "",
    enabled: !!userInfo?._id,
  });

  const handleRefetchNotifications = () => {
    invalidateQueriesByKeys(QUERY_KEYS.GET_NOTIFICATIONS_BY_USER);
  };

  return (
    <Popover>
      <PopoverTrigger
        className="size-10 flex items-center justify-center bg-white rounded-lg dark:bg-grayDarker border border-gray-200 dark:border-opacity-10"
        onClick={handleRefetchNotifications}
      >
        <IconBell />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 shadow-sm dark:bg-grayDarker dark:border-opacity-10 dark:border-gray-200"
      >
        <div className="p-3 font-bold text-base border-b border-b-gray-200 dark:border-opacity-10">
          Thông báo
        </div>
        {notifications && notifications?.length > 0 && (
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
