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
  createdAt: string;
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
  },
  salePrice: {
    type: Number,
  },
  desc: {
    type: String,
  },
  content: {
    type: String,
  },
  rating: {
    type: Number,
  },
  image: {
    type: String,
  },
  intro: {
    type: String,
  },
  status: {
    type: String,
  },
  level: {
    type: String,
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
});
const Course = models.Course || mongoose.model("Course", courseSchema);
export default Course;
