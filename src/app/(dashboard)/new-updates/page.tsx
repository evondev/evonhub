import { Heading } from "@/shared/components";

export interface BlogPageRootProps {}

export default function BlogPageRoot(_props: BlogPageRootProps) {
  return (
    <div className="flex flex-col gap-8">
      <Heading>Cập nhật mới 2026</Heading>
      <div className="flex flex-col gap-5">
        <div className="p-5 font-medium borderDarkMode bgDarkMode rounded-xl">
          1. Các khóa học hiện tại sẽ ngưng bán, các bạn vẫn học như bình
          thường. Năm 2026 này mình sẽ triển khai theo 1 mô hình mới. Các bạn
          cùng đón chờ nhé.
        </div>
      </div>
    </div>
  );
}
