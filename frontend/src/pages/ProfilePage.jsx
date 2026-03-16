import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../slices/authSlice";
import toast from "react-hot-toast";
import { User, Mail, Shield, Camera, Save, Key } from "lucide-react";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateUserName, setUpdateUserName] = useState(user?.userName || "");
  const [updatePassword, setUpdatePassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/users/updateuser/${user._id}`, {
        updateUserName,
        password: updatePassword || undefined,
        oldPassword: oldPassword || undefined,
      });
      dispatch(setUser(data.user));
      toast.success("Profile updated successfully!");
      setUpdatePassword("");
      setOldPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 overflow-hidden border border-gray-100">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-16 left-12 flex items-end">
            <div className="size-32 bg-white rounded-[2rem] p-1.5 shadow-lg relative">
              <div className="size-full bg-gray-50 rounded-[1.75rem] flex items-center justify-center border-2 border-dashed border-gray-200">
                <User className="size-12 text-gray-300" />
                <button className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                  <Camera className="size-4" />
                </button>
              </div>
            </div>
            <div className="ml-6 mb-2">
              <h1 className="text-3xl font-extrabold text-white leading-none mb-2">
                {user.userName}
              </h1>
              <p className="text-blue-100 flex items-center font-medium">
                <Shield className="size-4 mr-2" />
                {user.access} Account
              </p>
            </div>
          </div>
        </div>

        <div className="pt-24 pb-12 px-12">
          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400 size-5" />
                    <input
                      type="text"
                      value={updateUserName}
                      onChange={(e) => setUpdateUserName(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 size-5" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-12 outline-none text-gray-400 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 mb-4">
                Security Settings
              </h2>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    type="password"
                    value={updatePassword}
                    onChange={(e) => setUpdatePassword(e.target.value)}
                    placeholder="Enter new password to update (optional)"
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl shadow-blue-200 disabled:opacity-50"
              >
                <Save className="size-5" />
                <span>{loading ? "Updating..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
