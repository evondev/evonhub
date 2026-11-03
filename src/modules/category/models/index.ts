import { model, models, Schema } from "mongoose";
import { CategoryModelProps } from "../types";

const categorySchema = new Schema<CategoryModelProps>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Tên model phải là "Category": course.category đã ref tới tên này
const CategoryModel =
  models.Category || model<CategoryModelProps>("Category", categorySchema);

export default CategoryModel;
