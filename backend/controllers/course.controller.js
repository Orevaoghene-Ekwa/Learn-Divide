import { Course } from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();

    res.status(201).json({
      success: false,
      message: "Course created successfully",
      course: { ...course._doc },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
