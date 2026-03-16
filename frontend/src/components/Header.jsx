import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useGetCartQuery } from "../slices/cartApi";
import axios from "axios";
import toast from "react-hot-toast";

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const urlKeyword = new URLSearchParams(location.search).get("keyword");
    setKeyword(urlKeyword || "");
  }, [location.search]);

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const validCartItems = cartData?.cart?.items?.filter((item) => item.product) || [];
  const cartCount = validCartItems.length;

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
    } catch (err) {
      // Continue with client-side logout even if server call fails
    }
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-tight"
        >
          E-COM
        </Link>

        <form
          onSubmit={searchHandler}
          className="hidden md:flex flex-1 mx-8 relative"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full text-black bg-gray-100 border-none rounded-full py-2 px-6 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          <button type="submit" className="absolute right-4 top-2.5">
            <Search className="text-black size-5" />
          </button>
        </form>

        <div className="flex items-center space-x-6">
          <Link
            to="/cart"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group relative"
          >
            <div className="bg-gray-100 p-2.5 rounded-2xl group-hover:bg-blue-50 transition-colors">
              <ShoppingCart className="size-5" />
            </div>
            <span className="font-bold hidden sm:inline">Cart</span>
            {isAuthenticated && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-6 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-5">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 group"
                >
                  <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                    <User className="size-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-0.5">
                      Account
                    </p>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {user?.userName}
                    </p>
                  </div>
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-500 hover:text-blue-600 font-bold text-sm hidden lg:block transition-colors"
                >
                  My Orders
                </Link>
                {user?.access === "seller" && (
                  <Link
                    to="/seller/dashboard"
                    className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 font-bold text-sm hidden lg:block transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 inline-block" />
                    Dashboard
                  </Link>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-50 p-2.5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 group"
                title="Logout"
              >
                <LogOut className="size-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
