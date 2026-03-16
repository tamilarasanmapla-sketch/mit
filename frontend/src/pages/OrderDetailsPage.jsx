import React from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import {
  Package,
  Calendar,
  MapPin,
  DollarSign,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useGetOrderDetailsQuery } from "../slices/orderApi";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetOrderDetailsQuery(id, {
    skip: !id,
  });

  if (isLoading) return <Loader />;

  if (isError || !data?.order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-red-100 shadow-sm max-w-2xl mx-auto">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <AlertCircle className="size-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          {error?.data?.message || "Could not load order details. Please try again."}
        </p>
        <Link
          to="/orders"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-200"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const order = data.order;
  const statusColors = {
    Processing: "bg-yellow-100 text-yellow-700",
    Packed: "bg-purple-100 text-purple-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/orders"
        className="inline-flex items-center text-gray-400 hover:text-blue-600 font-bold mb-10 transition-colors group"
      >
        <ArrowLeft className="size-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-200 mb-2">Order ID</p>
              <p className="text-3xl font-bold font-mono">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 mb-2">Order Status</p>
              <span
                className={`px-4 py-2 rounded-full font-bold text-sm inline-block ${
                  statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8 space-y-8">
          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Calendar className="text-blue-600 size-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Order Date</p>
                <p className="font-bold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="text-green-600 size-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Amount</p>
                <p className="font-bold text-gray-900">
                  ${order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Package className="text-purple-600 size-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Items</p>
                <p className="font-bold text-gray-900">
                  {order.orderItems.length} item(s)
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.orderItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="size-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image || ""}
                              alt={item.productName}
                              className="size-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {item.productName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold">${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold">
                  {order.shippingPrice === 0
                    ? "Free"
                    : `$${order.shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (GST 5%)</span>
                <span className="font-bold">${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-2 text-blue-600" size={24} />
              Shipping Address
            </h3>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
              <p className="text-gray-900 font-bold">{order.shippingInfo.address}</p>
              <p className="text-gray-700">
                {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                {order.shippingInfo.pinCode}
              </p>
              <p className="text-gray-700">{order.shippingInfo.country}</p>
              <p className="text-gray-700 mt-2">
                Phone: {order.shippingInfo.phoneNo}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Payment Information
            </h3>
            <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="size-3 bg-green-600 rounded-full"></div>
                <p className="font-bold text-green-900">Payment Successful</p>
              </div>
              <p className="text-gray-700">
                Mode: {order.paymentInfo.status === "succeeded" ? "Paid" : "Pending"}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Transaction ID: {order.paymentInfo.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
