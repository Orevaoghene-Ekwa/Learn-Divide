import express from "express";
import {
  createCourse,
  enrolledCourses,
  enrollStudent,
  fetchAllCourses,
  fetchTutorCourses,
  updateProgress,
} from "../controllers/course.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const courseRouter = express.Router();

courseRouter.get("/tutor-courses", fetchTutorCourses);

courseRouter.get("/enrolled-courses", verifyToken, enrolledCourses);

courseRouter.get("/courses", fetchAllCourses)

courseRouter.post("/:courseId/enroll", enrollStudent);

courseRouter.post("/create-course", createCourse);

courseRouter.post("/update-progress", updateProgress);

export default courseRouter;
