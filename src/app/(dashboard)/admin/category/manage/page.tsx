import { fetchCategoriesManage } from "@/modules/category/actions";
import { CategoryManagePage } from "@/modules/category/pages";
import { NotFoundState } from "@/shared/components/not-found";

export default async function CategoryManageRoute() {
  // Chỉ trả dữ liệu cho admin, nên không có dữ liệu là không có quyền hoặc lỗi
  const categories = await fetchCategoriesManage();

  if (!categories) return <NotFoundState />;

  return <CategoryManagePage categories={categories} />;
}
