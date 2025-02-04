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

export const fetchCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.userID });
    
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
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
