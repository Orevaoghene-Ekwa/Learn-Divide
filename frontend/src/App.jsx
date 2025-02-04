import { Navigate, Route, Routes } from "react-router-dom";

import SignUpPage from "./pages/authPages/SignUpPage";
import LoginPage from "./pages/authPages/LoginPage";
import EmailVerificationPage from "./pages/authPages/EmailVerificationPage";
import TutorDashboard from "./pages/tutorPages/TutorDashboard";
import ForgotPasswordPage from "./pages/authPages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authPages/ResetPasswordPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TutorSignupPage from "./pages/authPages/TutorSignupPage";
import StudentDashboard from "./pages/studentPages/StudentDashboard";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateCourse from "./pages/tutorPages/CreateCourse";
import ProfilePage from "./pages/ProfilePage";
import ViewCoursePage from "./pages/ViewCoursePage";
import CoursePage from "./pages/studentPages/CoursePage";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const TutorRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!user.isVerified) {
    return <Navigate to="/home" replace />;
  }

  if (isAuthenticated && user.role !== "tutor") {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const StudentRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.role !== "student") {
    return <Navigate to="/home" replace />;
  }
  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <NavBar />
      <Routes>
        <Route path="/home" element={<LandingPage />} />
        <Route
          path="/tutor-dashboard"
          element={
            <TutorRoute>
              <TutorDashboard />
            </TutorRoute>
          }
        />
        <Route
        path="/create-course"
          element={
            <TutorRoute>
              <CreateCourse />
            </TutorRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/tutor-signup" element={<TutorSignupPage />} />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <ViewCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/content/:id"
          element={
            <StudentRoute>
              <CoursePage />
            </StudentRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* catch all routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
      <Footer />
    </div>
  );
}

export default App;
