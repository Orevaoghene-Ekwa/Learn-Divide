import express from "express";
import { createCourse } from "../controllers/course.controller.js";

const courseRouter = express.Router();

courseRouter.post("/create-course", createCourse);

export default courseRouter;
