import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const LoggedOutLinks = () => (
  <>
    <li>
      <Link className="hover:underline" to="/tutor-signup">
        Teach on Learn Divide
      </Link>
    </li>
    <li>
      <Link className="hover:underline" to="/signup">
        Sign Up
      </Link>
    </li>
    <li>
      <Link className="hover:underline" to="/login">
        Login
      </Link>
    </li>
  </>
);

const StudentLinks = () => (
  <>
    <li>
      <Link className="hover:underline" to="/student-dashboard">
        Dashboard
      </Link>
    </li>
    <li>
      <Link className="hover:underline" to="/courses">
        My Courses
      </Link>
    </li>
    <li>
      <Link className="hover:underline" to="/profile">
        Profile
      </Link>
    </li>
  </>
);

const TutorLinks = () => (
  <>
    <li>
      <Link className="hover:underline" to="/tutor-dashboard">
        Dashboard
      </Link>
    </li>
    <li>
      <Link className="hover:underline" to="/create-course">
        Create Course
      </Link>
    </li>
    <li>
      <Link className="hover:underline" to="/profile">
        Profile
      </Link>
    </li>
  </>
);

const NavBar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md z-50">
      <motion.div className="max-w-7xl mx-auto flex  items-center justify-between p-4 px-10">
        {/* Logo with Icon */}
        <Link to="/">
          <div className="hidden md:flex items-center text-3xl font-bold">
            <GraduationCap className="mr-2 w-10 h-10" />
            Learn Divide
          </div>
        </Link>

        {/* Logo with Icon on Mobile */}
        <div className="absolute left flex md:hidden items-center text-2xl font-bold ">
          <GraduationCap className="mr-2 w-8 h-8" />
          Learn Divide
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6">
          {isAuthenticated ? (
            user.role === "student" ? (
              <StudentLinks />
            ) : (
              <TutorLinks />
            )
          ) : (
            <LoggedOutLinks />
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={toggleMenu}>
          ☰
        </button>
      </motion.div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-0 right-0 w-1/3 h-screen bg-green-700/40 p-4 md:hidden">
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={toggleMenu}
          >
            ✕
          </button>
          <ul className="flex flex-col space-y-4 mt-10">
            {isAuthenticated ? (
              user.role === "student" ? (
                <StudentLinks />
              ) : (
                <TutorLinks />
              )
            ) : (
              <LoggedOutLinks />
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
