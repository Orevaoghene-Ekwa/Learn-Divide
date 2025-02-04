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
      },
    ],
    students: [
      {
        name: { type: String },
        email: { type: String, required: true },
        progress: { type: Number, default: 0 },
        watchedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
        feedback: [
          {
            comment: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5, required: true },
            createdAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],    
  },
  { timestamps: true }
);

export const Course = mongoose.model("course", courseSchema);
