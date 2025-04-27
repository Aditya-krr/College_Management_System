import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState();
  const [password, setPassword] = useState({ new: "", current: "" });

  const router = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const headers = { "Content-Type": "application/json" };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { enrollmentNo: router.state.loginid },
        { headers }
      )
      .then((res) => {
        if (res.data.success) {
          const user = res.data.user[0];
          setData(user);
          dispatch(
            setUserData({
              fullname: `${user.firstName} ${user.middleName} ${user.lastName}`,
              semester: user.semester,
              enrollmentNo: user.enrollmentNo,
              branch: user.branch,
            })
          );
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch, router.state.loginid, router.state.type]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    axios
      .post(
        `${baseApiURL()}/student/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        { headers }
      )
      .then((res) => {
        if (res.data.success) {
          changePasswordHandler(res.data.id);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
        console.error(err);
      });
  };

  const changePasswordHandler = (id) => {
    const headers = { "Content-Type": "application/json" };
    axios
      .put(
        `${baseApiURL()}/student/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        { headers }
      )
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
        console.error(err);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto my-8 flex flex-col md:flex-row justify-between items-start gap-8"
    >
      {data && (
        <>
          <div className="flex-1">
            <p className="text-2xl font-semibold">
              Hello {data.firstName} {data.middleName} {data.lastName} 👋
            </p>
            <div className="mt-4 space-y-2 text-lg">
              <p>Enrollment No: {data.enrollmentNo}</p>
              <p>Branch: {data.branch}</p>
              <p>Semester: {data.semester}</p>
              <p>Phone Number: +91 {data.phoneNumber}</p>
              <p>Email Address: {data.email}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mt-6 px-4 py-2 rounded font-medium shadow-sm transition-colors ${
                showPass
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Close Change Password" : "Change Password"}
            </motion.button>

            <AnimatePresence>
              {showPass && (
                <motion.form
                  onSubmit={checkPasswordHandler}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 border-t pt-4 border-blue-400 flex flex-col gap-4"
                >
                  <input
                    type="password"
                    value={password.current}
                    onChange={(e) =>
                      setPassword({ ...password, current: e.target.value })
                    }
                    placeholder="Current Password"
                    className=" h-[40px] w-[240px] px-4 py-2 border border-blue-400 rounded outline-none"
                    required
                  />
                  <input
                    type="password"
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                    placeholder="New Password"
                    className=" h-[40px] w-[240px] px-4 py-2 border border-blue-400 rounded outline-none"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="h-[40px] w-[240px] px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Change Password
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <motion.img
            src={process.env.REACT_APP_MEDIA_LINK + "/" + data.profile}
            alt="student profile"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-[240px] w-[240px] object-cover rounded-xl shadow-md"
          />
        </>
      )}
    </motion.div>
  );
};

export default Profile;
