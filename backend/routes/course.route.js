import express from "express";
import {
  createCourse,
  enrollStudent,
  fetchCourses,
} from "../controllers/course.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const courseRouter = express.Router();

courseRouter.get("/tutor-courses", verifyToken, fetchCourses);

courseRouter.post("/:courseId/enroll", enrollStudent)

courseRouter.post("/create-course", createCourse);

export default courseRouter;
