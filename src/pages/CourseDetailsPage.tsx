import {
  boxDetailClassName,
  primaryButtonClassName,
  widgetClassName,
} from "@/constants";
import { ICourse } from "@/database/course.model";
import { cn } from "@/lib/utils";
import Image from "next/image";

const CourseDetailsPage = ({ data }: { data: ICourse }) => {
  return (
    <div className="grid grid-cols-[2fr,1fr] gap-10">
      <div>
        <div className="aspect-video relative mb-3">
          <Image
            alt=""
            fill
            src={data.image}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <h1 className="font-bold text-2xl mb-10">{data.title}</h1>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold">Mô tả</h2>
            <p className="text-slate-400 text-sm">{data.desc}</p>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold">Chi tiết</h2>
            <div className="grid grid-cols-4 gap-5">
              <div className={boxDetailClassName}>
                <h4 className="text-xs text-slate-400">Lessons</h4>
                <span>128</span>
              </div>
              <div className={boxDetailClassName}>
                <h4 className="text-xs text-slate-400">Lessons</h4>
                <span>128</span>
              </div>
              <div className={boxDetailClassName}>
                <h4 className="text-xs text-slate-400">Lessons</h4>
                <span>128</span>
              </div>
              <div className={boxDetailClassName}>
                <h4 className="text-xs text-slate-400">Lessons</h4>
                <span>128</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold">Nội dung</h2>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold">Yêu cầu</h2>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold">Lợi ích</h2>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold">Q/A</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className={widgetClassName}>
          <a
            href="https://fb.com/tuan.trananh.0509"
            target="_blank"
            className={cn(primaryButtonClassName, "w-full text-sm")}
          >
            Liên hệ
          </a>
        </div>
        <div className={widgetClassName}>Rating</div>
        <div className={widgetClassName}>
          <h3 className="text-lg font-bold mb-5">Tác giả</h3>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
