import { TLevel, TStatus } from "@/types";
import { EcourseLabel } from "@/types/enums";
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
  rating: number;
  image: string;
  intro: string;
  status: TStatus;
  level: TLevel;
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
  rating: {
    type: Number,
    default: 5,
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
    default: "pending",
  },
  level: {
    type: String,
    default: "easy",
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
