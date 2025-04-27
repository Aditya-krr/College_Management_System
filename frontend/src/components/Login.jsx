import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiLogIn } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseApiURL } from "../baseUrl";

const Login = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Student");
  const [formVisible, setFormVisible] = useState(false);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (data) => {
    if (data.loginid && data.password) {
      const headers = { "Content-Type": "application/json" };
      axios
        .post(`${baseApiURL()}/${selected.toLowerCase()}/auth/login`, data, { headers })
        .then((response) => {
          navigate(`/${selected.toLowerCase()}`, {
            state: { type: selected, loginid: response.data.loginid },
          });
        })
        .catch((error) => {
          toast.dismiss();
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div className="relative h-screen w-100% overflow-hidden">
      <iframe
        className="absolute inset-0 w-[99%] h-[113%] object-cover "
        src="https://www.canva.com/design/DAGlhylAn-8/eybeqMIO3E7n0r3stgZL5A/view?embed"
        alt="Background"
      />

      {/* Slide-in Form Container */}
      <div className={`absolute right-0 top-0 h-full w-full md:w-[40%] bg-white/0  transition-all duration-500 ease-out ${
        formVisible ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col items-center h-full justify-center p-8">
          {/* Role Selector */}
          <div className="flex gap-4 mb-8">
            {['Student', 'Faculty', 'Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setSelected(role)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selected === role
                    ? 'bg-blue-500/90 text-white shadow-lg'
                    : 'bg-white/50 text-black-700 hover:bg-white/30'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Transparent Login Form */}
          <div className="w-full max-w-md bg-white/20 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {selected} Login
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="eno">
                  {selected} ID
                </label>
                <input
                  type="number"
                  id="eno"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  {...register("loginid")}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  {...register("password")}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-blue-500/90 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
              >
                Login
                <FiLogIn className="text-xl" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;