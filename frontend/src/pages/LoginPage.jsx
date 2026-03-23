import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const { data } = await axios.post("/api/users/login", formData, {
        withCredentials: true,
      });
      dispatch(setUser(data.user));
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      dispatch(setError(message));
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-xl shadow-blue-50 border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-blue-600 size-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-200">
          <LogIn className="size-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-400 mt-2">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="relative">
          <label className="text-sm font-semibold text-gray-700 ml-1 mb-2 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400 size-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-semibold text-gray-700 ml-1 mb-2 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 size-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-8 text-sm text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-bold hover:underline"
        >
          Create one now
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
