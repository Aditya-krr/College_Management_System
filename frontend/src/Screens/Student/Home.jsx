import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Profile from "./Profile";
import Timetable from "./Timetable";
import Marks from "./Marks";
import Notice from "../../components/Notice";
import Material from "./Material";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const menuItems = ["My Profile", "Timetable", "Marks", "Material", "Notice"];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  const renderComponent = () => {
    switch (selectedMenu) {
      case "Timetable":
        return <Timetable />;
      case "Marks":
        return <Marks />;
      case "Material":
        return <Material />;
      case "Notice":
        return <Notice />;
      case "My Profile":
      default:
        return <Profile />;
    }
  };

  return (
    <section>
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
    </section>
  );
};

export default Home;
