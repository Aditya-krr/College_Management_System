import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseApiURL } from "../../baseUrl";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });

  useEffect(() => {
    const headers = { "Content-Type": "application/json" };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { employeeId: router.state.loginid },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          setData(response.data.user);
          dispatch(
            setUserData({
              fullname: `${response.data.user[0].firstName} ${response.data.user[0].middleName} ${response.data.user[0].lastName}`,
              employeeId: response.data.user[0].employeeId,
            })
          );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router.state.loginid, router.state.type]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    axios
      .post(
        `${baseApiURL()}/faculty/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  const changePasswordHandler = (id) => {
    const headers = { "Content-Type": "application/json" };
    axios
      .put(
        `${baseApiURL()}/faculty/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full mx-auto my-8 flex flex-col md:flex-row justify-between items-start gap-8"
    >
      {data && (
        <>
          <div className="flex-1">
            <p className="text-2xl font-semibold">
              Hello {data[0].firstName} {data[0].middleName} {data[0].lastName} 👋
            </p>
            <div className="mt-4 space-y-2 text-lg">
              <p>Employee Id: {data[0].employeeId}</p>
              <p>Post: {data[0].post}</p>
              <p>Email: {data[0].email}</p>
              <p>Phone: {data[0].phoneNumber}</p>
              <p>Department: {data[0].department}</p>
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
                  />
                  <input
                    type="password"
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                    placeholder="New Password"
                    className=" h-[40px] w-[240px] px-4 py-2 border border-blue-400 rounded outline-none"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className=" h-[40px] w-[240px] px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Change Password
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <motion.img
            src={process.env.REACT_APP_MEDIA_LINK + "/" + data[0].profile}
            alt="faculty profile"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-[200px] w-[200px] object-cover rounded-xl shadow-md"
          />
        </>
      )}
    </motion.div>
  );
};

export default Profile;
