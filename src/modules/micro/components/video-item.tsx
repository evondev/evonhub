import { IconVideo } from "@/shared/components";
import { SimpleButton } from "@/shared/components/button";
import { MicroStatus } from "@/shared/constants/micro.constant";
import Link from "next/link";
import { MicroItemData } from "../types";

export interface VideoItemProps {
  data: MicroItemData;
}

export default function VideoItem({ data }: VideoItemProps) {
  return (
    <>
      <div className="border borderDarkMode bgDarkMode p-3 rounded-md flex flex-col">
        <h4 className="uppercase text-gray-500 text-xs font-medium mb-1">
          Video
        </h4>
        <h3 className="font-bold text-sm lg:text-lg mb-5">{data.title}</h3>
        <div
          className="text-sm text-gray-700 mb-5 dark:text-white"
          dangerouslySetInnerHTML={{
            __html: data.content || "Nội dung mô tả đang được cập nhật sớm!",
          }}
        ></div>
        <div className="flex items-center justify-between gap-2 border-t border-t-gray-200 dark:border-t-gray-200/10 pt-5 mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white shrink-0">
            <IconVideo className="size-5" />
            <span>{data.duration || 5} phút</span>
          </div>
          {data.status === MicroStatus.Approved && (
            <Link href={`/micro/${data.slug}`}>
              <SimpleButton>Học ngay</SimpleButton>
            </Link>
          )}
          {data.status === MicroStatus.Pending && (
            <SimpleButton className="from-textPrimary to-textPrimary">
              Coming soon
            </SimpleButton>
          )}
        </div>
      </div>
    </>
  );
}
