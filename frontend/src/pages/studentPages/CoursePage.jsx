import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const CoursePage = () => {
  const { courseId } = useParams();
  const location = useLocation()
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [progress, setProgress] = useState(0);
  const { updateProgress, user, } = useAuthStore();

  const course = location.state?.course;

  const handleVideoClick = async (videoId) => {
    try {
      const response = await updateProgress(courseId, videoId, user.email);

      // Update progress from the response
      setProgress(response.progress);
      setIsVideoWatched(true); // Mark video as watched
    } catch (error) {
      console.error("Error updating video progress:", error);
    }
  };

  return (
    <div>
      <h3>Video Title</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            course.video.map((video) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={course._id}
                onClick={() => handleVideoClick(video._Id)}
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
          }
        </div>
      <button onClick={handleVideoClick} disabled={isVideoWatched}>
        {isVideoWatched ? "Watched" : "Click to Watch"}
      </button>
      <p>Progress: {progress}%</p>
    </div>
  );
};

export default CoursePage;
