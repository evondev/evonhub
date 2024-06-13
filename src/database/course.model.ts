import { ECourseLevel, ECourseStatus, EcourseLabel } from "@/types/enums";
import mongoose, { Document, Schema, models } from "mongoose";
mongoose.Promise = global.Promise;
export interface ICourse extends Document {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number;
  desc: string;
  content: string;
  rating: number[];
  image: string;
  intro: string;
  status: ECourseStatus;
  level: ECourseLevel;
  category: Schema.Types.ObjectId;
  label: EcourseLabel;
  info: {
    requirements: string[];
    gained: string[];
    qa: {
      question: string;
      answer: string;
    }[];
  };
  review: Schema.Types.ObjectId[];
  lecture: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  views: number;
  cta: string;
  ctaLink: string;
  createdAt: Date;
  seoKeywords: string;
  free: boolean;
  _destroy: boolean;
}
const courseSchema = new Schema<ICourse>({
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
    enum: [
      ECourseStatus.PENDING,
      ECourseStatus.APPROVED,
      ECourseStatus.REJECTED,
    ],
    default: ECourseStatus.PENDING,
  },
  level: {
    type: String,
    enum: [ECourseLevel.EASY, ECourseLevel.MEDIUM, ECourseLevel.EXPERT],
    default: ECourseLevel.EASY,
  },
  label: {
    type: String,
    default: EcourseLabel.NONE,
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
});
const Course = models.Course || mongoose.model("Course", courseSchema);
export default Course;
