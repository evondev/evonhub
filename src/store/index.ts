import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface GlobalState {
  isFullscreen: boolean;
  toggleFullscreen: (isFullscreen: boolean) => void;
  currentUser?: any;
  setCurrentUser?: (currentUser: any) => void;
  permissions?: any[];
  setPermissions?: (permissions: any) => void;
  userRole?: string;
  setUserRole?: (userRole: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        isFullscreen: false,
        toggleFullscreen: (isFullscreen: boolean) =>
          set((state) => ({ isFullscreen: isFullscreen })),
        currentUser: undefined,
        setCurrentUser: (currentUser: any) =>
          set((state) => ({ currentUser: currentUser })),
        permissions: [],
        setPermissions: (permissions: any) =>
          set((state) => ({ permissions: permissions })),
        userRole: "",
        setUserRole: (userRole: string) =>
          set((state) => ({ userRole: userRole })),
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
