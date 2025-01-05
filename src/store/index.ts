import { UserRole } from "@/shared/constants/user.constants";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface GlobalState {
  isExpanded?: boolean;
  toggleExpanded?: (isExpanded: boolean) => void;
  currentUser?: any;
  setCurrentUser?: (currentUser: any) => void;
  permissions?: any[];
  setPermissions?: (permissions: any) => void;
  userRole?: UserRole;
  setUserRole?: (userRole: UserRole) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        isExpanded: false,
        toggleExpanded: (isExpanded: boolean) =>
          set((state) => ({ isExpanded: isExpanded })),
        currentUser: undefined,
        setCurrentUser: (currentUser: any) =>
          set((state) => ({ currentUser: currentUser })),
        permissions: [],
        setPermissions: (permissions: any) =>
          set((state) => ({ permissions: permissions })),
        userRole: UserRole.User,
        setUserRole: (userRole: UserRole) =>
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
