import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../../components/Input";
import {
  ChevronUpSquare,
  DollarSign,
  Loader,
  PersonStanding,
  PlusCircle,
  VideoIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const CreateCourse = () => {
  const { createCourse, error, user, isLoading } = useAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor] = useState(user.name);
  const [price, setPrice] = useState("");
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // Function to handle adding new video fields
  const addVideoField = () => {
    setVideos([...videos, { title: "", url: "", description: "" }]);
  };

  // Function to handle changes in video fields
  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...videos];
    updatedVideos[index][field] = value;
    setVideos(updatedVideos);
  };

  // Function to remove a video field
  const removeVideoField = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const courseData = {
      //   title,
      //   description,
      //   instructor,
      //   price,
      //   videos
      // }
      await createCourse(title, description, instructor, price, videos);
      navigate("/tutor-dashboard");
      toast.success("Course created successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`Failed to create course. \nAll fields are required`);
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen w-screen mt-18">
      {/* Sidebar */}
      <div className="w-1/4 p-6 border-r-6 bg-gray-900/80">
        <h2 className="mt-10 text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Course
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            icon={ChevronUpSquare}
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            icon={PersonStanding}
            type="textarea"
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            icon={DollarSign}
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="mt-4">
            <h3 className="text-white font-semibold">Course Videos</h3>
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg mt-2"
              >
                <Input
                  icon={VideoIcon}
                  type="text"
                  placeholder="Video Title"
                  value={video.title}
                  onChange={(e) =>
                    handleVideoChange(index, "title", e.target.value)
                  }
                />
                <Input
                  icon={VideoIcon}
                  type="text"
                  placeholder="Video URL"
                  value={video.url}
                  onChange={(e) =>
                    handleVideoChange(index, "url", e.target.value)
                  }
                />
                <Input
                  icon={VideoIcon}
                  type="text"
                  placeholder="Video Description"
                  value={video.description}
                  onChange={(e) =>
                    handleVideoChange(index, "description", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="text-red-500 hover:underline self-end"
                  onClick={() => removeVideoField(index)}
                >
                  Remove Video
                </button>
              </div>
            ))}

            {/* Add Video Button */}
            <button
              type="button"
              onClick={addVideoField}
              className="mt-2 flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg"
            >
              <PlusCircle size={18} />
              Add Video
            </button>
          </div>

          {/* {error && <p className="text-red-500 font-semibold mt-2">{error}</p>} */}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className=" animate-spin mx-auto" size={24} />
            ) : (
              "Upload"
            )}
          </motion.button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="min-h-screen w-screen text-gray-300">
        <h2 className="mt-10 text-3xl font-bold mb-6 text-center">Preview</h2>
        <div className="border p-4 rounded shadow">
          <h3 className="text-3xl font-semibold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            {title || "Course Title"}
          </h3>
          <p className="text-gray-300 mb-3">
            {description || "Course description will appear here."}
          </p>
          <p className="font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Price: ${price || "0.00"}</p>
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={index} className="mt-4">
                <h4 className="font-semibold ">{video.title}</h4>
                <iframe
                  className="w-full h-64 "
                  src={video.url}
                  title={video.title}
                  allowFullScreen
                ></iframe>
                <p className="text-gray-300 mb-5">{video.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-300 mt-6">No videos added</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
