import {
  CourseLabel,
  CourseLevel,
  CourseStatus,
} from "@/shared/constants/course.constants";
import mongoose, { models, Schema } from "mongoose";
import { CourseModelProps } from "../types";

const courseSchema = new Schema<CourseModelProps>({
  title: {
    type: String,
  },
  slug: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  salePrice: {
    type: Number,
    default: 0,
  },
  desc: {
    type: String,
  },
  content: {
    type: String,
  },
  rating: {
    type: [Number],
    default: [5],
  },
  image: {
    type: String,
    default: "/default.jpg",
  },
  intro: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(CourseStatus),
    default: CourseStatus.Pending,
  },
  level: {
    type: String,
    enum: Object.values(CourseLevel),
    default: CourseLevel.Easy,
  },
  label: {
    type: String,
    default: CourseLabel.None,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  info: {
    requirements: {
      type: [String],
    },
    gained: {
      type: [String],
    },
    qa: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  lecture: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  views: {
    type: Number,
    default: 0,
  },
  cta: {
    type: String,
    default: "Mua ngay",
  },
  ctaLink: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seoKeywords: {
    type: String,
  },
  free: {
    type: Boolean,
    default: false,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
  isPackage: {
    type: Boolean,
    default: false,
  },
  minPrice: {
    type: Number,
    default: 0,
  },
});
const CourseModel = models.Course || mongoose.model("Course", courseSchema);
export default CourseModel;
