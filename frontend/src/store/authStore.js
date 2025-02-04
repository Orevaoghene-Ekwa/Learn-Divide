import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";
const COURSE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/course"
    : "/api/course";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  allCourses: [],
  tutorCourses: [],
  courses: [],
  courseList: [],
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  tutorSignup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/tutor-signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  createCourse: async (title, description, instructor, price, videos) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${COURSE_URL}/create-course`, {
        title,
        description,
        instructor,
        price,
        videos,
      });
      set((state) => ({
        courses: [...state.courses, response.data.course],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error creating course",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchAllCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${COURSE_URL}/courses`); 
      set({ allCourses: response.data.allCourses || [], isLoading: false });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error fetching courses",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchTutorCourses: async (tutorName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${COURSE_URL}/tutor-courses`, {
        params: { tutorName }, 
      }); 
      set({ tutorCourses: response.data.tutorCourses || [], isLoading: false });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error fetching courses",
        isLoading: false,
      });
      throw error;
    }
  },

  enrollStudent: async (courseID, name, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${COURSE_URL}/${courseID}/enroll`, {
        name,
        email,
      });
      set({ course: response.data.course, error: null, isLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error occured during enrollment",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProgress: async (courseId, videoId, email) => {
    set({ error: null });
    try {
      const response = await axios.post(`${COURSE_URL}/update-progress`, {
        courseId,
        videoId,
        email,
      });
      set({ progress: response.data.progress, error: null });
    } catch (error) {
      set({
        error: error.response.data.message || "Error occured during enrollment",
        isLoading: false,
      });
      throw error;
    }
  },

  enrolledCourses: async (coursesEnrolled) => {
    try {
    set({isLoading:true, error:null})
      const response = await axios.get(`${COURSE_URL}/enrolled-courses`, {
        params: {coursesEnrolled}
      });
      console.log("API Response:", response.data); // Debugging
      set({ courseList: response.data.courseList || [], isLoading: false });
    } catch (error) {
      console.log(error)
      set({isLoading: false});
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });

      // Fetch courses after login
      const { fetchTutorCourses, enrolledCourses, fetchAllCourses } = useAuthStore.getState()
      await fetchAllCourses()
      if (response.data.user.role === "student") {
        await enrolledCourses(response.data.user.enrolledCourses);
      }
      if (response.data.user.role === "tutor") { // Check if the user is a tutor
        await fetchTutorCourses(response.data.user.name); // Pass the tutor's ID
      }
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      console.log("Auth Check Response:", response.data);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });

      // Fetch courses after authentication check
      const { fetchTutorCourses, fetchAllCourses, enrolledCourses } = useAuthStore.getState();
      await fetchAllCourses();
      if (response.data.user.role === "tutor") { // Check if the user is a tutor
        await fetchTutorCourses(response.data.user.name); // Pass the tutor's ID
      }
      if (response.data.user.role === "student") {
        await enrolledCourses(response.data.user.enrolledCourses);
      }
    } catch (error) {
      console.log(error)
      set({ isCheckingAuth: false, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        courses: [],
        isLoading: false,
        message: null,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
  forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
  resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
