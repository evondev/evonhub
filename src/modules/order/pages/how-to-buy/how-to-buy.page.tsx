import {
  HowToBuyFreeBanner,
  HowToBuyHeader,
  HowToBuySteps,
  HowToBuySupportCard,
  HowToBuyTroubles,
} from "./components";

/**
 * Trang tĩnh, server component. Bề rộng và lưới hai cột bám trang chi tiết đơn
 * để khách đi từ đây sang trang đơn không thấy khung nhảy.
 */
export function HowToBuyPage() {
  return (
    <div className="flex max-w-[68rem] flex-col gap-4 sm:gap-6">
      <HowToBuyHeader />
      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
          <HowToBuyFreeBanner />
          <HowToBuySteps />
          <HowToBuyTroubles />
        </div>
        <HowToBuySupportCard />
      </div>
    </div>
  );
}
