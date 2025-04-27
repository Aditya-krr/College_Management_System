/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

import Notice from "../../components/Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import { baseApiURL } from "../../baseUrl";
import Admin from "./Admin";
import Profile from "./Profile";
import Branch from "./Branch";

const menuItems = [
  "Profile",
  "Student",
  "Faculty",
  "Branch",
  "Notice",
  "Subjects",
  "Admin",
];

const Home = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Profile");
  const [dashboardData, setDashboardData] = useState({
    studentCount: "",
    facultyCount: "",
  });

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  useEffect(() => {
    getStudentCount();
    getFacultyCount();
  }, []);

  const getStudentCount = () => {
    axios
      .get(`${baseApiURL()}/student/details/count`)
      .then((res) => {
        if (res.data.success) {
          setDashboardData((prev) => ({
            ...prev,
            studentCount: res.data.user,
          }));
        } else toast.error(res.data.message);
      })
      .catch(console.error);
  };

  const getFacultyCount = () => {
    axios
      .get(`${baseApiURL()}/faculty/details/count`)
      .then((res) => {
        if (res.data.success) {
          setDashboardData((prev) => ({
            ...prev,
            facultyCount: res.data.user,
          }));
        } else toast.error(res.data.message);
      })
      .catch(console.error);
  };

  const renderComponent = () => {
    switch (selectedMenu) {
      case "Branch":
        return <Branch />;
      case "Notice":
        return <Notice />;
      case "Student":
        return <Student />;
      case "Faculty":
        return <Faculty />;
      case "Subjects":
        return <Subjects />;
      case "Admin":
        return <Admin />;
      case "Profile":
      default:
        return <Profile />;
    }
  };

  return (
    <>
      {load && (
        <>
          <Navbar />
          <div className="max-w-6xl mx-auto px-4">
            <ul className="flex flex-wrap justify-center gap-4 my-8">
              {menuItems.map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`text-sm sm:text-base md:text-lg font-medium rounded-xl px-4 py-2 cursor-pointer shadow-md transition-all ${
                    selectedMenu === item
                      ? "bg-blue-600 text-white ring-2 ring-blue-400"
                      : "bg-white text-blue-700 hover:bg-blue-100"
                  }`}
                  onClick={() => setSelectedMenu(item)}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {renderComponent()}
            </motion.div>
          </div>
        </>
      )}
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
