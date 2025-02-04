import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const {allCourses} = useAuthStore()
  const navigate = useNavigate()

  const handleCourseClick = (course) => {
    navigate(`/course/${course._id}`, { state: { course } });
  };
  return (
    <div className="mt-30 p-4">
      <h1 className="text-white text-3xl">All Courses</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCourses.map((course) => (
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
        ))}
      </div>
    </div>
  );
};

export default LandingPage;

// User.find({ _id: userId })
//   .populate('enrolledCourses')
//   .exec((err, user) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(user.enrolledCourses);
//     }
//   });
