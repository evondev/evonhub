import { Heading } from "@/shared/components";
import Link from "next/link";

export interface BlogPageRootProps {}

export default function BlogPageRoot(_props: BlogPageRootProps) {
  return (
    <div className="flex flex-col gap-8">
      <Heading>Cập nhật mới</Heading>
      <div className="flex flex-col gap-5">
        <div className="p-5 font-medium borderDarkMode bgDarkMode rounded-xl">
          1. Tính năng bình luận mình sẽ ẩn, các bạn có vấn đề gì thì cứ hỏi vào
          nhóm hỗ trợ các khóa học tương ứng ở Telegram. Mình sẽ vào đó giải đáp
          cho nhanh nha.
        </div>
        <div className="p-5 font-medium borderDarkMode bgDarkMode rounded-xl">
          2. Mỗi khi các bạn hoàn thành một bài học thì sẽ được cộng 10 điểm vào{" "}
          <Link href="/leaderboard" className="text-primary font-semibold">
            Leaderboard
          </Link>
          . Điểm này mục đích để tạo động lực cho các bạn học nhiều thì sẽ được
          điểm cao. Hiển thị Profile cũng đẹp hơn và mình đang suy nghĩ có nhiều
          ưu đãi cho các bạn có điểm cao.
        </div>
        <div className="p-5 font-medium borderDarkMode bgDarkMode rounded-xl">
          3. Dự định thêm tính năng reactions cho bài học. Mục đích là để thống
          kê bài học theo các reactions để biết được chất lượng bài học.
        </div>
        <div className="p-5 font-medium borderDarkMode bgDarkMode rounded-xl">
          4. Thêm trang dashboard để hiển thị tổng quan của người học. Giúp
          người học biết được đang học tới đâu, còn bao nhiêu bài học nữa và các
          đề xuất khóa học khác.
        </div>
      </div>
    </div>
  );
}
