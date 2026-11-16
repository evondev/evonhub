# Xem nhà: khu đất 3D theo bậc học

Mỗi học viên có một **khu đất trên đảo riêng giữa biển**, dựng bằng Three.js. Bậc học (1–10, theo tổng
giờ học từ trước tới nay, `STUDY_TIERS`) quyết định trên đảo có gì: bậc thấp là lều với xe đạp, bậc cao
là villa, siêu xe, du thuyền, máy bay riêng. Trên bảng xếp hạng có nút **"Xem nhà"**, bấm vào thì mở
trang 3D khu đất của người đó.

Mục đích giống Làng bên speak-now: một phần thưởng **nhìn được** cho giờ học. Đây không phải game,
người xem không điều khiển gì cả, chỉ xoay camera ngắm và bấm vào từng món để xem đó là gì, mở ở bậc nào.

Tham khảo: `~/dev/speak-now/docs/plans/village.md` và `~/dev/speak-now/src/features/village/`
(đảo nhà 7 bậc `partner-house-tiers.ts`, kit 3dviz-pro-max chép trong `scene/kits/`).

## Đã chốt (2026-11-16, bro chốt theo đề xuất hết)

Ảnh chia sẻ (câu 6) để sau MVP. Nút "Xem nhà" có trên mọi dòng của bảng (nút icon).

| Câu hỏi | Đề xuất | Lý do |
|---|---|---|
| Bối cảnh | **Đảo riêng giữa biển**, không làm đảo nổi trên trời như speak-now | Có biển thì mới có chỗ cho du thuyền, ca nô, bến thuyền |
| Bậc mở thêm thế nào | **Cộng dồn**: nhà được nâng cấp lên, xe cộ thì giữ lại hết | Lên bậc mà mất xe cũ thì hụt hẫng. Bãi xe đầy dần cũng là một cách cho thấy mình đã đi được bao xa |
| Ai xem được nhà người khác | **Ai xem được bảng thì xem được nhà**, kể cả khách | Trang nhà chỉ hiện tên, avatar, bậc, tổng giờ, và bảng xếp hạng đã công khai những thứ này |
| Admin, Expert | Không có nút trên bảng (vì họ không lên bảng). Mở URL nhà của chính mình thì vẫn xem được | Giữ đúng luật bảng xếp hạng |
| Tông hình | **Low-poly tươi, dựng bằng code** (không tải file GLB) | Nhẹ, không vướng bản quyền model, cùng gu với speak-now. Siêu xe hay du thuyền low-poly vẫn nhận ra được nhờ dáng và màu |
| Xem trước bậc kế | Ở nhà của chính mình có nút "Bậc kế có gì": món sắp mở hiện mờ như bản phác, kèm dòng "còn 4 giờ 20 phút" | Tạo động lực, dùng lại `getTierProgress` |

## Thang 10 bậc (nháp, chỉnh sau khi xem bản thử)

Mốc giờ giữ đúng `STUDY_TIERS`. Mỗi bậc có **một lần nâng nhà** hoặc **một món mới**, hoặc cả hai.

| Bậc | Tên | Tổng giờ | Nhà | Món mới |
|---|---|---|---|---|
| 1 | Tập sự | 1 phút | Lều cắm trại, lửa trại | Xe đạp |
| 2 | Băng tinh | 1 giờ | Nhà gỗ nhỏ | Xe máy |
| 3 | Tinh tú | 3 giờ | Nhà cấp 4 mái ngói, sân trước | Ô tô con |
| 4 | Nhiệt huyết | 6 giờ | (giữ) | Khinh khí cầu bay lơ lửng trên đảo, bến gỗ nhỏ |
| 5 | Đam mê | 10 giờ | Nhà phố 2 tầng, ban công | Ca nô ở bến |
| 6 | Vương miện | 15 giờ | Biệt thự, hồ bơi | Siêu xe đỗ trước cửa |
| 7 | Chiến cúp | 25 giờ | (giữ), thêm vườn, đèn sân | Du thuyền nhỏ, bến mở rộng |
| 8 | Kim cương | 40 giờ | Villa ven biển, hồ bơi tràn bờ | Siêu xe thứ hai, du thuyền lớn thay du thuyền nhỏ |
| 9 | Thạch anh | 60 giờ | (giữ), thêm sân đáp | Trực thăng |
| 10 | Huyền thoại | 100 giờ | Dinh thự trên đỉnh đảo, cờ, đèn sáng cả đảo | Máy bay riêng bay vòng quanh đảo, cầu vồng sau mưa |

- Bro nhắc cả "máy bay" lẫn "khinh khí cầu": khinh khí cầu ở bậc 4 (sớm, dễ thương), máy bay riêng là
  phần thưởng cuối ở bậc 10.
- Chưa có bậc (0 phút): bãi đất trống, cắm biển "Học phút đầu tiên để dựng lều". Nhà người khác thì ghi
  "Chưa có phút học nào", không mời người xem đi học.

## Trải nghiệm

- **Lối vào:**
  - Mỗi dòng trên bảng (`leaderboard-row.tsx`) có nút icon `Home` (lucide) cạnh huy hiệu bậc, kèm
    `aria-label="Xem nhà của <tên>"`. Dòng nào không có `username` thì không có nút.
  - Bục top 3 (`leaderboard-podium-slot.tsx`) có nút chữ "Xem nhà".
  - Thẻ "Bậc của bạn" (`tier-progress-card.tsx`) có nút `primary` "Xem nhà của bạn".
  - Sau MVP có thể thêm nút trên trang công khai `/user-profile/<username>`.
- **Trang `/house/<username>`:** canvas chiếm cả màn hình. Thẻ đầu trang có avatar, "Nhà của <tên>",
  "Bậc 6 · Vương miện · 17 giờ học", lối về "Bảng xếp hạng". Góc phải có danh sách món đã mở (✓) và món
  chưa mở (khoá, ghi mốc giờ).
- **Camera:** OrbitControls có giới hạn (không chui xuống biển, không zoom quá xa), tự xoay chậm khi
  không ai chạm. Trên điện thoại, kéo một ngón để xoay, chụm hai ngón để zoom.
- **Bấm vào một món:** hiện nhãn nhỏ, ví dụ "Siêu xe · mở ở bậc 6 Vương miện".
- **Lên bậc:** máy lưu bậc đã xem lần trước (localStorage, bọc try/catch). Mở nhà của chính mình mà
  bậc đã cao hơn lần trước thì camera bay tới món mới, món đó nảy lên kèm pháo hoa và thông báo
  "Lên Vương miện: biệt thự và siêu xe". Xem nhà người khác thì không chạy cảnh này.
- **Sống động nhẹ:** sóng biển, thuyền dập dềnh, khinh khí cầu trôi, chim biển bay. Trời ngày hay đêm
  theo giờ trên máy (6h tới 18h là ngày), tối thì đèn nhà và đèn sân sáng.
- **Máy yếu** (≤ 4 nhân hay ≤ 4 GB RAM) và `prefers-reduced-motion`: tắt bóng đổ mềm và hậu kỳ, giảm
  độ phân giải, ngừng tự xoay.

## Kỹ thuật

- **Thư viện:** thêm `three` và `@types/three`. Viết Three.js thuần như speak-now, không dùng
  react-three-fiber: bê được code engine sang mà không phải viết lại, lại thêm ít phụ thuộc. Engine
  **nạp động** trong hook (`import("../scene/create-estate-scene")`) để three.js chỉ tải ở trang này,
  không làm nặng bảng xếp hạng.
- **Kit 3dviz-pro-max (MIT):** chép nguyên văn các file cần dùng vào `scene/kits/`, giữ `LICENSE` và
  `README.md` ghi commit nguồn như speak-now, rồi cho thư mục này ra khỏi ESLint. Cần đổi hình thì bọc
  bên ngoài, không sửa trong kit. Xe cộ, thuyền, máy bay thì tự dựng bằng primitive, vì kit không có.
- **Chỗ đặt code:** để trong module `leaderboard`, vì bậc học (`STUDY_TIERS`, `getStudyTier`) đã nằm ở
  đó. Như vậy không phải import chéo module.
  ```
  src/app/(dashboard)/house/[username]/page.tsx   # chỉ đọc params, render page
  src/modules/leaderboard/
    pages/house-page/house.page.tsx               # server: tìm user, đọc tổng giờ, tính bậc
    pages/house-page/components/                  # thẻ đầu trang, danh sách món, nhãn, thông báo (client)
    hooks/use-estate-scene.ts                     # nạp động engine, dựng, dọn khi rời trang
    scene/                                        # engine Three.js, 1 file 1 việc
      create-estate-scene.ts                      # điểm vào: nhận tierLevel, trả handle (dispose, focus...)
      build-island.ts  build-sea.ts  day-cycle.ts
      estate-houses.ts                            # nhà theo bậc: lều → ... → dinh thự
      estate-vehicles.ts  estate-boats.ts  estate-aircraft.ts
      estate-layout.ts                            # toạ độ cố định từng món trên đảo
      celebrate.ts  dispose-scene.ts  merge-meshes.ts
      kits/                                       # 3dviz vendored
    constants/estate.constants.ts                 # ESTATE_ITEMS: món nào, mở ở bậc nào, tên hiển thị
    types/                                        # EstateItem, EstateSceneHandle...
    utils/estate-items.utils.ts                   # getUnlockedItems(level), getNextTierItems(level) + test
  ```
- **Dữ liệu:** không có model mới, không cần migrate. Page server tìm user theo `username` rồi gọi
  `getUserTierProgress(userId)` đã có sẵn. Không có user thì `notFound()`. Mỗi lượt xem nhà chỉ tốn một
  query `StudyTotal`.
- **Bảng món là nguồn sự thật:** `ESTATE_ITEMS` (món nào, mở ở bậc nào, tên hiển thị) dùng chung cho
  engine dựng cảnh, danh sách ở góc phải, và nhãn khi bấm. Copy và cảnh sẽ không lệch nhau.
- **Xem thử mọi bậc:** chạy dev thì `/house/<username>?tier=8` dựng bậc 8 trong bộ nhớ để chụp ảnh và
  soát hình, không ghi gì xuống DB. Production bỏ qua tham số này.
- **Dọn bộ nhớ:** rời trang thì dispose geometry, material, texture, renderer (chép `dispose-scene.ts`
  bên speak-now). Mỗi loại vật tĩnh gộp thành một mesh (`merge-meshes.ts`) để ít draw call.
- **Next 14 / React 18:** engine là `.ts` thuần, mount trong `useEffect`, nên không vướng SSR. Trang
  bọc `"use client"` ở component canvas, phần còn lại vẫn là server component.

## Các bước

0. **Bản thử (dùng skill 3dviz-pro-max):** một file HTML độc lập, có thanh trượt bậc 1→10 để bro xem
   cả thang, ở `docs/prototypes/tier-estate.html`. Bro duyệt hình xong mới đưa vào app. Bước này dễ sửa
   nhất, nên chỉnh tông, bố cục đảo, dáng xe và thuyền ở đây.
   **Đã dựng 2026-11-16, chờ bro duyệt hình.** Mở thẳng file trong trình duyệt (three.js tải từ CDN);
   `?tier=7` mở sẵn bậc 7, `?night=1` / `?night=0` ép đêm / ngày. Mọi hình tự dựng bằng code, chưa dùng
   kit 3dviz (kit toàn nhà gỗ cổ tích, lệch tông villa hiện đại). Khi đưa vào app thì tách file
   này thành các file trong `scene/` như mục Kỹ thuật.
   **2026-11-16 bro duyệt, bảo tích hợp luôn.** Đợt sửa cuối của bản thử: cây dừa dựng lại (tàu lá
   gấp chữ V, rủ xuống), người chạy bộ quanh bãi cát (bậc 1, 4, 8), người tập thể dục (bậc 2), góc nghỉ
   mát trên bãi cát (bậc 3), người nằm ghế cạnh hồ bơi, đàn cá ở nước cạn; khoá 30 khung hình mỗi giây,
   ngừng vẽ khi tab ẩn, sóng biển chạy trong shader, máy yếu giảm độ phân giải và bóng.
   **Đã tích hợp bước 1–4 cùng lúc (chưa commit):** `src/modules/leaderboard/scene/` (engine, 12 file),
   `hooks/use-estate-scene.ts`, `pages/house-page/`, `constants/estate.constants.ts`,
   `utils/estate.utils.ts` (+ test), route `src/app/(dashboard)/house/[username]/page.tsx`, nút ở
   `leaderboard-row`, `leaderboard-podium-slot`, `tier-progress-card`. Người dân (chạy bộ, tập thể dục,
   nghỉ mát) có trong `ESTATE_ITEMS` nhưng không có dòng ở danh sách món.
1. **Nền móng:** cài three, chép kit và các tiện ích engine, route `/house/[username]`, page server,
   hook nạp động. Dựng đảo, biển, trời, và các bậc 1–3. Thêm nút "Xem nhà" trên bảng và trên thẻ bậc.
   `ESTATE_ITEMS` có test.
2. **Bậc 4–7:** khinh khí cầu, nhà phố, ca nô, biệt thự, hồ bơi, siêu xe, du thuyền nhỏ.
3. **Bậc 8–10:** villa, du thuyền lớn, trực thăng, dinh thự, máy bay riêng. Cảnh lên bậc và pháo hoa.
4. **Đánh bóng:** ngày và đêm, chế độ máy yếu, xem trước bậc kế, danh sách món. Cập nhật mọi chỗ mô tả
   bậc cho người dùng (`tier-ladder-dialog.tsx` có thể thêm dòng "mở: siêu xe").

Mỗi bước kiểm bằng `npm run dev`, `npm run lint`, `npm run build`, và chụp màn hình cả máy tính lẫn
điện thoại.

## Cần bro chốt

1. Bối cảnh đảo giữa biển, được không?
2. Cộng dồn (giữ xe cũ) hay mỗi bậc thay hẳn cảnh mới?
3. Khách chưa đăng nhập có được xem nhà không?
4. Thang 10 bậc ở trên: đổi món nào? Ví dụ muốn siêu xe sớm hơn, hay bỏ trực thăng.
5. Nút trên **mọi dòng** của bảng, hay chỉ top 3 và thẻ của mình?
6. Sau MVP có làm ảnh chia sẻ (chụp canvas thành PNG để đăng Facebook) không?

## Mùa, dịp lễ, mưa bão (2026-11-16, bro yêu cầu, tham khảo Làng bên speak-now; chưa commit)

- **Theo ngày trên máy người xem** (`utils/estate-occasions.utils.ts`, có test): xuân 2–4, hạ 5–8,
  thu 9–11, đông 12–1; Giáng sinh 20–26/12; Tết ±7 ngày quanh mùng 1 (bảng `TET_FIRST_DAYS`
  2027–2030); Trung thu 7 ngày trước tới 1 ngày sau rằm (bảng `MID_AUTUMN_DAYS` 2026–2030).
- **Mùa** (`scene/estate-seasons.ts`): xuân cánh hoa hồng bay + 6 bụi hoa đào; hạ như thường; thu lá
  vàng cam rơi, tàu dừa ngả vàng; đông tuyết rơi, tuyết đọng lốm đốm trên cỏ, tàu dừa phủ sương.
- **Dịp lễ** (`scene/estate-festive.ts`, chung chỗ `FESTIVE_SPOT` ở bãi cỏ trước bên trái): Giáng sinh
  cây thông có đèn nháy, ngôi sao, quà, mọi người đội mũ Noel; Tết cây đào treo 4 đèn lồng đỏ; Trung
  thu cột tre, đèn ông sao xoay, 3 đèn lồng, trăng to vàng. Trăng hiện mọi tối, mọc trên biển sau đảo.
- **Mưa bão** (`scene/estate-storm.ts`, `scene/estate-shelter.ts`): nút "Mưa bão" / "Tạnh mưa". Mưa
  xiên, chớp, trời sầm, sương dày, sóng cao, cửa sổ sáng, dừa lắc mạnh, lửa trại lụi, đom đóm và chim
  biển trốn. Mọi người (chạy bộ, tập thể dục, nằm khăn, nằm ghế hồ bơi) giơ tay che đầu chạy vào cửa
  nhà; tạnh gần hết thì lần lượt ra lại chỗ cũ. Bật âm thanh: mưa rào, gió, sấm; dế và lửa trại lặng.
- **Xem thử khi chạy dev:** `/house/<username>?date=2026-12-24` (Tết 2027-02-06, Trung thu
  2027-09-15, xuân 2027-03-10...), ghép được với `&tier=8`. Production bỏ qua.
- Chưa làm: nhạc Giáng sinh, pháo hoa đúng ngày lễ.
