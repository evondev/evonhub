import { Heading } from "@/shared/components";

export interface PageProps {}

export default function Page(_props: PageProps) {
  return (
    <div>
      <Heading className="mb-10">Tâm thư của Evondev</Heading>
      <div className="flex flex-col gap-5 text-lg leading-loose p-5 rounded-xl bgDarkMode borderDarkMode border">
        <div>Các bạn học viên thân mến ❤️</div>
        <div>
          Trước tiên, mình muốn gửi lời cảm ơn chân thành đến tất cả các bạn đã
          đồng hành cùng mình, đặc biệt là những bạn đã mua khóa học lập trình
          của mình trên KTcity trước đây. Sự tin tưởng và niềm yêu thích học tập
          của các bạn là động lực lớn nhất để mình tiếp tục sứ mệnh này.
        </div>
        <div>
          Khi KTcity ngừng hoạt động, mình biết nhiều bạn lo lắng về việc không
          thể tiếp tục truy cập khóa học đã mua. Vì vậy, mình đã tự tay xây dựng
          một nền tảng mới từ con số 0, với mong muốn mang đến cho các bạn một
          không gian học tập ổn định và chất lượng. Từ việc tạo video hướng dẫn,
          viết code mẫu, đến duy trì server để mọi người có thể học bất cứ lúc
          nào – tất cả đều do một mình mình thực hiện, với tất cả tâm huyết.
        </div>
        <div>
          Tuy nhiên, để duy trì nền tảng này, mình đang đối mặt với những chi
          phí không nhỏ như server, phần mềm, và cả thời gian bỏ ra để cập nhật
          nội dung. Hôm nay, mình viết tâm thư này để chia sẻ tình hình và hy
          vọng nhận được sự hỗ trợ nho nhỏ từ các bạn. Nếu có thể, các bạn cân
          nhắc donate một khoản nhỏ, chỉ <strong>10.000</strong> hoặc{" "}
          <strong>20.000</strong> đồng – như một ly cà phê sẻ chia. Số tiền này
          sẽ giúp mình giữ cho nền tảng hoạt động mượt mà, đảm bảo các bạn có
          thể tiếp tục hành trình học lập trình của mình.
        </div>
        <div>
          Mình cam kết sử dụng mọi đóng góp một cách minh bạch để cải thiện nền
          tảng. Quan trọng hơn, mình muốn nhấn mạnh rằng việc donate là{" "}
          <strong>hoàn toàn tự nguyện</strong>. Dù bạn có donate hay không, mình
          vẫn luôn nỗ lực để các bạn – đặc biệt là những học viên đã mua khóa
          học trên KTcity, hoặc trên nền tảng Evonhub này – được truy cập đầy đủ
          nội dung và nhận hỗ trợ tốt nhất.
        </div>
        <div>Nếu bạn muốn ủng hộ, bạn có thể donate qua:</div>
        <div>
          <p>
            <strong>Momo: 0937253577</strong>
          </p>
          <p>
            <strong>Ngân hàng ACB</strong>, STK: <strong>33366668888</strong>,
            Chủ tài khoản:
            <strong>TRAN ANH TUAN</strong>, Chi nhánh: <strong>TPHCM</strong>
          </p>
        </div>
        <div>
          Cảm ơn các bạn đã dành thời gian đọc tâm thư này. Hãy cùng nhau tiếp
          tục hành trình học lập trình, chinh phục những dòng code và xây dựng
          ước mơ của mình nhé!
        </div>
        <div>
          <p>Trân trọng.</p>
          <p>
            <strong>Evondev</strong>
          </p>
          <p>Người sáng lập Evonhub</p>
        </div>
      </div>
    </div>
  );
}
