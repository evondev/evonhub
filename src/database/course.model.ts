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
  status: string;
  level: string;
  category: Schema.Types.ObjectId;
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
    default:
      "http://localhost:3000/_next/image?url=https%3A%2F%2Fspotlight-modern.highfivethemes.com%2Fcontent%2Fimages%2Fsize%2Fw800%2Fformat%2Fwebp%2F2023%2F06%2Fdemo-image-00002-1.webp&w=128&q=75",
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
    default: "beginner",
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
});
const Course = models.Course || mongoose.model("Course", courseSchema);
export default Course;
