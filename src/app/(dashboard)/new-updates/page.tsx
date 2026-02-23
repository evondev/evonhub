import { Heading } from "@/shared/components";

export interface BlogPageRootProps {}

export default function BlogPageRoot(_props: BlogPageRootProps) {
  return (
    <div className="flex flex-col gap-8">
      <Heading>Cập nhật mới 2026</Heading>
      <div className="flex flex-col gap-5 text-xl font-light leading-relaxed">
        <div className="p-5 font-medium borderDarkMode bgDarkMode rounded-xl">
          1. Mình ra mắt khóa học dạng Study Together(
          <strong>FREE hoàn toàn</strong>) nghĩa là mình sẽ học 1 chủ đề nào đó
          và mình quay lại quá trình học của mình, những khó khăn mình gặp phải
          và cách mình vượt qua chúng. Các bạn có thể học theo mình để tham khảo
          cách mình học, cách mình tư duy để giải quyết vấn đề....
        </div>
        <div className="p-5 font-medium borderDarkMode bgDarkMode rounded-xl">
          2. Mình sẽ ra mắt khóa học <strong>Micro</strong> với 1 vài video ngắn
          khoảng 10-15 phút để giải quyết 1 vấn đề cụ thể nào đó, những video
          này sẽ rất ngắn gọn và đi thẳng vào vấn đề luôn, không dài dòng dòng
          như những video mình đã làm trước đây, giúp các bạn giải quyết nhanh
          chóng những vấn đề mà các bạn đang gặp phải mà không cần phải xem cả 1
          khóa học dài.
        </div>
      </div>
    </div>
  );
}
