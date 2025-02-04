import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

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

export const fetchTutorCourses = async (req, res) => {
  try {
    const { tutorName } = req.query;
    if (!tutorName) {
      return res.status(400).json({
        success: false,
        message: "Tutor Name is required",
      });
    }
    const courses = await Course.find({ instructor: tutorName });
    
    res.status(200).json({
      success: true,
      tutorCourses: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
    });
  }
};

export const fetchAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses
    
    res.status(200).json({
      success: true,
      allCourses: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
    });
  }
};

export const enrolledCourses = async (req, res) => {
  try {
    console.log("Request User ID:", req.userId); // Debugging line

    if (!req.userID) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID" });
    }
    const user = await User.findById(req.userID).populate('enrolledCourses');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    res.status(200).json({
      success: true,
      courseList: user.enrolledCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving enrolled courses",
    });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { email, name } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Check if student is already enrolled
    if (course.students.some((student) => student.email === email)) {
      return res.status(400).json({ success: false, message: "Already enrolled." });
    }

    // Add student to the array
    course.students.push({ email, name });
    await course.save();

    const user = await User.findOne({ email });
    if (user) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Student enrolled successfully.",
      course,
    });

  } catch (error) {
    console.error("Enrollment error:", error); 
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId, videoId, email } = req.body;

    // Find the course and student
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const student = course.students.find(student => student.email === email);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not enrolled in course." });
    }

    // Check if the video is already watched
    if (!student.watchedVideos.includes(videoId)) {
      // Add video to watchedVideos
      student.watchedVideos.push(videoId);
    }

    // Calculate progress
    const totalVideos = course.videos.length;
    const watchedVideos = student.watchedVideos.length;
    student.progress = (watchedVideos / totalVideos) * 100;

    // Save the course with updated progress
    await course.save();

    res.status(200).json({ success: true, message: "Progress updated successfully.", progress: student.progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addFeedback = async (req, res) => {
  const { courseId, studentName, comment, rating } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the student in the course
    const student = course.students.find((s) => s.name === studentName);
    if (!student) {
      return res.status(404).json({ message: "Student not enrolled in this course" });
    }

    // Add feedback
    student.feedback.push({ comment, rating });

    await course.save();
    res.status(200).json({ message: "Feedback added successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
