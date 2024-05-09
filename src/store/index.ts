import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface GlobalState {
  isFullscreen: boolean;
  toggleFullscreen: (isFullscreen: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        isFullscreen: false,
        toggleFullscreen: (isFullscreen: boolean) =>
          set((state) => ({ isFullscreen: isFullscreen })),
      }),

      {
        name: "global-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          isFullscreen: true,
        }),
      }
    )
  )
);
