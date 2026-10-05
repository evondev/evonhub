import { FilterTabs, SearchInput } from "@/shared/components/common";
import { FilterTabItem } from "@/shared/types";
import { RefObject } from "react";
import {
  UserManageFilters,
  UserManageTab,
  UserRoleFilter as UserRoleFilterValue,
} from "../../../types/user-manage.types";
import { UserRoleFilter } from "./user-role-filter";

interface UserManageToolbarProps {
  filters: UserManageFilters;
  tabs: FilterTabItem<UserManageTab>[];
  onTabChange: (tab: UserManageTab) => void;
  onRoleChange: (role: UserRoleFilterValue) => void;
  onSearch: (keyword: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  /** id của bảng mà tab đang lọc */
  controlsId: string;
}

/**
 * Tab trạng thái bên trái, ô tìm và lọc vai trò bên phải. Từ xl một hàng;
 * hẹp hơn thì tab một hàng, ô tìm một hàng. Dưới sm ô tìm lên đầu, dưới là
 * nút "Trạng thái:" và "Vai trò:"
 */
export function UserManageToolbar({
  filters,
  tabs,
  onTabChange,
  onRoleChange,
  onSearch,
  searchInputRef,
  controlsId,
}: UserManageToolbarProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      {/* flex-wrap: màn hẹp mà hai nút không vừa thì nút vai trò xuống hàng, không bóp chữ */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterTabs
          tabs={tabs}
          activeValue={filters.tab}
          onChange={onTabChange}
          controlsId={controlsId}
        />
        <UserRoleFilter
          value={filters.role}
          onChange={onRoleChange}
          className="sm:hidden"
        />
      </div>
      <div className="order-first flex items-center gap-2 sm:order-none">
        <SearchInput
          ref={searchInputRef}
          value={filters.search}
          onSearch={onSearch}
          placeholder="Tìm tên, username, email"
          label="Tìm thành viên"
          className="flex-1 xl:w-72 xl:flex-none"
        />
        <UserRoleFilter
          value={filters.role}
          onChange={onRoleChange}
          className="hidden sm:inline-flex"
        />
      </div>
    </div>
  );
}
