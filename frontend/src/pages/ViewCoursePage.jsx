import { useLocation, useParams } from "react-router-dom";
import NotFound from "./NotFoundPage";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const ViewCoursePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, error, enrollStudent, isLoading } = useAuthStore();

  const course = location.state?.course;

  if (!course) {
    return <NotFound />;
  }

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await enrollStudent(id, user.name, user.email);
      toast.success("Enrolled Successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="mt-50">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Instructor: {course.instructor}</p>
      <p>Price: {course.price}</p>

      <motion.button
        className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        onClick={handleEnroll}
      >
        {isLoading ? (
          <Loader className=" animate-spin mx-auto" size={24} />
        ) : (
          "Enroll"
        )}
      </motion.button>
    </div>
  );
};

export default ViewCoursePage;
