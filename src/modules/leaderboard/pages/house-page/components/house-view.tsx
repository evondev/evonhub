"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ESTATE_OWN_SIGN_LINES,
  ESTATE_TOAST_VISIBLE_MS,
  ESTATE_VISIT_SIGN_LINES,
} from "../../../constants/estate.constants";
import { useEstateScene } from "../../../hooks/use-estate-scene";
import { EstatePickedItem, HousePageData } from "../../../types/estate.types";
import { HouseControls } from "./house-controls";
import { HouseHeaderCard } from "./house-header-card";
import { HouseItemPanel } from "./house-item-panel";
import { HouseItemTip } from "./house-item-tip";
import { HouseToast } from "./house-toast";

interface HouseViewProps {
  data: HousePageData;
}

/** Khung cảnh 3D chiếm cả vùng nội dung, các thẻ nổi phía trên */
export function HouseView({ data }: HouseViewProps) {
  const { tierLevel, totalSeconds, isOwnHouse } = data;
  const [pickedItem, setPickedItem] = useState<EstatePickedItem | null>(null);
  const [toastText, setToastText] = useState("");

  const handleCelebrate = useCallback(
    (itemNames: string[]) => setToastText(`Lên bậc ${tierLevel}: ${itemNames.join(", ")}`),
    [tierLevel],
  );
  const { containerRef, isLoading, viewState, toggleNight, toggleGhost, toggleAutoRotate, toggleSound, toggleStorm } = useEstateScene({
    tierLevel,
    isOwnHouse,
    signLines: isOwnHouse ? ESTATE_OWN_SIGN_LINES : ESTATE_VISIT_SIGN_LINES,
    previewDateKey: data.previewDateKey,
    onPick: setPickedItem,
    onCelebrate: handleCelebrate,
  });

  useEffect(() => {
    if (!toastText) return;

    const timer = window.setTimeout(() => setToastText(""), ESTATE_TOAST_VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [toastText]);

  return (
    <div className="relative h-[calc(100dvh-7rem)] min-h-[480px] overflow-hidden rounded-2xl border border-border bg-sky-200 lg:h-[calc(100dvh-8rem)]">
      <div ref={containerRef} className="absolute inset-0" />
      {isLoading && (
        <p className="absolute inset-0 grid place-items-center text-sm text-sky-900/70">Đang dựng đảo…</p>
      )}
      {pickedItem && <HouseItemTip item={pickedItem} totalSeconds={totalSeconds} />}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-4 sm:top-4">
        <HouseHeaderCard data={data} />
        <div className="hidden lg:block">
          <HouseItemPanel tierLevel={tierLevel} />
        </div>
      </div>
      {toastText && <HouseToast text={toastText} />}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <HouseControls
          isNight={viewState.isNight}
          isGhost={viewState.isGhost}
          isAutoRotate={viewState.isAutoRotate}
          isSoundOn={viewState.isSoundOn}
          isStorm={viewState.isStorm}
          canPreviewNext={isOwnHouse && tierLevel < 10}
          onToggleNight={toggleNight}
          onToggleGhost={toggleGhost}
          onToggleAutoRotate={toggleAutoRotate}
          onToggleSound={toggleSound}
          onToggleStorm={toggleStorm}
        />
      </div>
    </div>
  );
}
