"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createEstateAudio, type EstateAudio } from "../scene/estate-audio";
import type { EstatePickedItem, EstateSceneHandle } from "../types/estate.types";
import {
  isLowPowerDevice,
  prefersReducedMotion,
  readSeenEstateTier,
  writeSeenEstateTier,
} from "../utils/estate-browser.utils";
import { getEstateOccasions, parseEstateDateKey } from "../utils/estate-occasions.utils";
import { isEstateNightHour } from "../utils/estate.utils";

interface UseEstateSceneOptions {
  tierLevel: number;
  /** Nhà của chính mình: nhớ bậc đã xem để lần sau lên bậc thì chạy cảnh mừng */
  isOwnHouse: boolean;
  signLines: string[];
  /** Dev xem thử mùa và dịp: "2026-12-24"; null là hôm nay */
  previewDateKey: string | null;
  onPick: (item: EstatePickedItem | null) => void;
  onCelebrate: (itemNames: string[]) => void;
}

interface EstateViewState {
  isNight: boolean;
  isGhost: boolean;
  isAutoRotate: boolean;
  isSoundOn: boolean;
  isStorm: boolean;
}

// Dựng đảo vào khung chứa, dọn khi rời trang. Engine nạp động nên three.js chỉ
// tải ở trang này; callback đi qua ref để engine không dựng lại mỗi lần render.
export function useEstateScene({ tierLevel, isOwnHouse, signLines, previewDateKey, onPick, onCelebrate }: UseEstateSceneOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<EstateSceneHandle | null>(null);
  const audioRef = useRef<EstateAudio | null>(null);
  const callbacksRef = useRef({ onPick, onCelebrate });
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState<EstateViewState>({
    isNight: false,
    isGhost: false,
    isAutoRotate: true,
    isSoundOn: false,
    isStorm: false,
  });

  useEffect(() => {
    callbacksRef.current = { onPick, onCelebrate };
  }, [onPick, onCelebrate]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let isCancelled = false;
    const isNight = isEstateNightHour(new Date().getHours());
    const isReducedMotion = prefersReducedMotion();
    const seenTier = isOwnHouse ? readSeenEstateTier() : null;

    const occasions = getEstateOccasions(parseEstateDateKey(previewDateKey) || new Date());

    setViewState({ isNight, isGhost: false, isAutoRotate: !isReducedMotion, isSoundOn: false, isStorm: false });

    void import("../scene/create-estate-scene").then(({ createEstateScene }) => {
      if (isCancelled) return;

      handleRef.current = createEstateScene({
        container,
        tierLevel,
        isNight,
        isLite: isLowPowerDevice(),
        isReducedMotion,
        celebrateFromTier: seenTier,
        signLines,
        occasions,
        callbacks: {
          onPick: (item) => callbacksRef.current.onPick(item),
          onCelebrate: (itemNames) => callbacksRef.current.onCelebrate(itemNames),
          onThunder: (delaySeconds, strength) => audioRef.current?.thunder(delaySeconds, strength),
        },
      });
      setIsLoading(false);

      if (isOwnHouse) writeSeenEstateTier(tierLevel);
    });

    return () => {
      isCancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
      audioRef.current?.dispose();
      audioRef.current = null;
    };
    // Chỉ dựng lại khi đổi bậc, đổi chủ nhà hay đổi ngày xem thử; signLines đi theo isOwnHouse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierLevel, isOwnHouse, previewDateKey]);

  const toggleNight = useCallback(() => {
    const isNight = !viewState.isNight;
    handleRef.current?.setNight(isNight);
    audioRef.current?.setNight(isNight);
    setViewState({ ...viewState, isNight });
  }, [viewState]);

  const toggleGhost = useCallback(() => {
    const isGhost = !viewState.isGhost;
    handleRef.current?.setGhost(isGhost);
    setViewState({ ...viewState, isGhost });
  }, [viewState]);

  const toggleAutoRotate = useCallback(() => {
    const isAutoRotate = !viewState.isAutoRotate;
    handleRef.current?.setAutoRotate(isAutoRotate);
    setViewState({ ...viewState, isAutoRotate });
  }, [viewState]);

  // Tạo âm thanh ngay trong cú bấm: trình duyệt chỉ cho phát sau thao tác của người xem.
  const toggleSound = useCallback(() => {
    const isSoundOn = !viewState.isSoundOn;

    if (isSoundOn) {
      audioRef.current = createEstateAudio({ isNight: viewState.isNight, isStorm: viewState.isStorm, hasCampfire: tierLevel >= 1 });
    } else {
      audioRef.current?.dispose();
      audioRef.current = null;
    }
    setViewState({ ...viewState, isSoundOn });
  }, [viewState, tierLevel]);

  const toggleStorm = useCallback(() => {
    const isStorm = !viewState.isStorm;
    handleRef.current?.setStorm(isStorm);
    audioRef.current?.setStorm(isStorm);
    setViewState({ ...viewState, isStorm });
  }, [viewState]);

  return { containerRef, isLoading, viewState, toggleNight, toggleGhost, toggleAutoRotate, toggleSound, toggleStorm };
}
