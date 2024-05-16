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
  rating: Schema.Types.ObjectId[];
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
  createdAt: Date;
  review: Schema.Types.ObjectId[];
  lecture: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  views: number;
}
const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
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
  rating: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
});
const Course = models.Course || mongoose.model("Course", courseSchema);
export default Course;
