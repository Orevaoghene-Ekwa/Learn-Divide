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
  courses: [],
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

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${COURSE_URL}/tutor-courses`); // Adjust API endpoint
      set({ courses: response.data.courses, isLoading: false });
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
      set({ course: response.data.course, error:null, isLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error occured during enrollment",
        isLoading: false,
      });
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
      await useAuthStore.getState().fetchCourses();
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
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });

      // Fetch courses after authentication check
      await useAuthStore.getState().fetchCourses();
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
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
}));
