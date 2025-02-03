import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    videos: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String, required: true },
        progress: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Course = mongoose.model("course", courseSchema);
