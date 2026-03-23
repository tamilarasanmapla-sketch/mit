import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PackageOpen, Truck, X } from "lucide-react";
import {
  useAcceptOrderMutation,
} from "../slices/dashboardApi";
import {
  useUpdateOrderMutation,
} from "../slices/orderApi";

const statusClass = (status) => {
  if (status === "Delivered") return "bg-emerald-100 text-emerald-700";
  if (status === "Shipped") return "bg-blue-100 text-blue-700";
  if (status === "Packed") return "bg-purple-100 text-purple-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  if (status === "Accepted") return "bg-green-100 text-green-700";
  return "bg-yellow-100 text-yellow-700";
};

const getNextOrderStatus = (status) => {
  if (status === "Accepted" || status === "Processing") return "Packed";
  if (status === "Packed") return "Shipped";
  if (status === "Shipped") return "Delivered";
  return null;
};

const SellerOrdersTable = ({ orders, refetch }) => {
  const [orderSearch, setOrderSearch] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [acceptOrder] = useAcceptOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const filteredOrders = useMemo(() => {
    const q = orderSearch.toLowerCase();
    return orders.filter(
      (o) => o._id?.toLowerCase().includes(q) || o.orderStatus?.toLowerCase().includes(q),
    );
  }, [orders, orderSearch]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder({ orderId }).unwrap();
      toast.success("Order accepted!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to accept order");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrder({ id: orderId, status }).unwrap();
      toast.success(`Order marked as ${status}`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-800">Order Management</h3>
        <input
          type="text"
          placeholder="Search by ID or status..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-teal-300 outline-none"
        />
      </div>
      {filteredOrders.length === 0 ? (
        <div className="p-10 text-center text-gray-400">No orders found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-600">#{o._id?.slice(-8)}</td>
                  <td className="px-5 py-4 text-gray-800 font-medium">
                    {o.user?.userName || "Guest"}
                    <div className="text-xs text-gray-500 mt-1">
                      {o.user?.email && <div>Email: {o.user.email}</div>}
                      {o.shippingInfo && (
                        <div>
                          Address: {o.shippingInfo.address}, {o.shippingInfo.city},{" "}
                          {o.shippingInfo.state}, {o.shippingInfo.country},{" "}
                          {o.shippingInfo.pinCode}
                        </div>
                      )}
                      {o.shippingInfo?.phoneNo && <div>Phone: {o.shippingInfo.phoneNo}</div>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {o.orderItems?.map((item, idx) => (
                      <div key={idx} className="mb-2">
                        <span className="font-semibold">{item.productName}</span> x
                        {item.quantity} <br />
                        <span className="text-xs text-gray-500">
                          ₹{item.price} | Seller: {item.seller}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800">
                    ₹{o.totalPrice?.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {o.orderStatus === "Processing" && (
                        <button
                          onClick={() => handleAcceptOrder(o._id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                        >
                          <PackageOpen className="w-3.5 h-3.5" /> Accept
                        </button>
                      )}
                      {getNextOrderStatus(o.orderStatus) && (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(
                              o._id,
                              getNextOrderStatus(o.orderStatus),
                            )
                          }
                          disabled={updatingOrderId === o._id}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-60"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Mark {getNextOrderStatus(o.orderStatus)}
                        </button>
                      )}
                      {["Processing", "Accepted", "Packed", "Shipped"].includes(
                        o.orderStatus,
                      ) && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o._id, "Cancelled")}
                          disabled={updatingOrderId === o._id}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-60"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersTable;
