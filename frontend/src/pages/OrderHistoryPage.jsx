import React from "react";
import { useMyOrdersQuery } from "../slices/orderApi";
import Loader from "../components/Loader";
import {
  Package,
  Calendar,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderHistoryPage = () => {
  const { data, isLoading, isError, error } = useMyOrdersQuery();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-red-100 shadow-sm">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <AlertCircle className="size-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error Loading Orders
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          {error?.data?.message || "Failed to load your order history. Please try again later."}
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-200"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <Package className="size-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No orders found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          You haven't placed any orders yet. Start shopping and fill your
          history with amazing products!
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-200"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 flex items-center">
        <Package className="mr-3 text-blue-600" /> Your Order History
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    <Package className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Order ID
                    </h3>
                    <p className="font-mono text-gray-900 font-bold">
                      #{order._id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:flex-1 md:ml-12">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                      <Calendar className="size-3 mr-1" /> Date
                    </span>
                    <span className="text-gray-900 font-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-50 text-green-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {order.orderStatus === "Delivered" ? (
                        <CheckCircle className="size-3 mr-1.5" />
                      ) : (
                        <Clock className="size-3 mr-1.5" />
                      )}
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Total
                    </span>
                    <span className="text-xl font-extrabold text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/order/${order._id}`}
                  className="bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-500 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center group/btn"
                >
                  View Details
                  <ChevronRight className="size-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
