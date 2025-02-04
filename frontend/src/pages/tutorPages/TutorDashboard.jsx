import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";

const TutorDashboard = () => {
  const { user, tutorCourses } = useAuthStore();
  const navigate = useNavigate();

  const handleCourseClick = (course) => {
    navigate(`/course/${course._id}`, { state: { course } });
  };

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 mt-25">
      <h1 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        Hello, {user.name}!
      </h1>

      <div className="mt-6">
        <h2 className="text-2xl text-gray-300 font-semibold">Your Courses</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorCourses && tutorCourses.length > 0 ? (
            tutorCourses.map((course) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className="cursor-pointer w-full sm:w-72 md:w-80 h-auto p-6 bg-gradient-to-r from-gray-800 to-gray-900  
				          rounded-lg shadow-lg hover:from-green-800 hover:to-emerald-900
				          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <h3 className="text-xl text-green-300 font-semibold">
                  {course.title}
                </h3>
                <p className="text-gray-200 mt-2">{course.description}</p>
              </motion.div>
            ))
          ) : (
            <>
              <p className="text-gray-500">
                You have not uploaded any courses yet.
              </p>
              <p>
                <Link to="/create-course" className="text-green-400 underline">
                  Create Course
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
