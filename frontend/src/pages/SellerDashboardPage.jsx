import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetSellerStatsQuery,
} from "../slices/dashboardApi";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../slices/productsApi";
import SellerOrdersTable from "../components/SellerOrdersTable";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, ShoppingCart, Package, Clock, AlertTriangle,
  LayoutDashboard, Truck, Plus, Pencil, Trash2,
  X, Save, TrendingUp, BarChart3,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: Truck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const CATEGORIES = ["electronics", "fashion", "home", "books", "toys", "sports", "others"];

const SellerDashboardPage = () => {
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productName: "", description: "", price: "", category: "electronics", stock: "",
  });

  const { data, isLoading, refetch } = useGetSellerStatsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  if (!user || user.access !== "seller") return <Navigate to="/" replace />;

  const stats = data?.stats || {};
  const products = data?.products || [];
  const orders = data?.orders || [];

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...productForm }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(productForm).unwrap();
        toast.success("Product created successfully!");
      }
      setShowAddProduct(false);
      setEditingProduct(null);
      setProductForm({ productName: "", description: "", price: "", category: "electronics", stock: "" });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      productName: p.productName, description: p.description || "",
      price: p.price, category: p.category, stock: p.stock,
    });
    setShowAddProduct(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-500 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          </div>
          <p className="text-teal-100 text-sm">Manage your products, orders, and analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-4">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={DollarSign} label="Total Sales" value={`₹${(stats.totalSales || 0).toLocaleString()}`} color="bg-emerald-500" />
              <StatCard icon={ShoppingCart} label="Orders Today" value={stats.ordersToday || 0} color="bg-blue-500" />
              <StatCard icon={Package} label="Products Listed" value={stats.productsListed || 0} color="bg-purple-500" />
              <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders || 0} color="bg-amber-500" />
              <StatCard icon={AlertTriangle} label="Low Stock Products" value={stats.lowStockProducts || 0} color="bg-rose-500" />
            </div>

            {/* Quick Sales Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Sales Per Day (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data?.salesPerDay || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="sales" stroke="#14b8a6" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Add Product Modal */}
            {showAddProduct && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                  <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-600">Product Name</label>
                    <input type="text" required value={productForm.productName} onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                      className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-600">Description</label>
                    <textarea required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none h-20 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Price (₹)</label>
                    <input type="number" required min="0.01" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Stock</label>
                    <input type="number" required min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Category</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none bg-white">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                      <Save className="w-4 h-4" /> {editingProduct ? "Update" : "Create"} Product
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">My Products ({products.length})</h3>
                <button onClick={() => { setShowAddProduct(true); setEditingProduct(null); setProductForm({ productName: "", description: "", price: "", category: "electronics", stock: "" }); }}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              {products.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No products yet. Add your first product!</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Price</th>
                        <th className="px-5 py-3">Stock</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-medium text-gray-800 max-w-[200px] truncate">{p.productName}</td>
                          <td className="px-5 py-4 text-gray-500 capitalize">{p.category}</td>
                          <td className="px-5 py-4 text-gray-700">₹{p.price?.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`font-semibold ${p.stock < 10 ? "text-red-600" : "text-gray-700"}`}>{p.stock}</span>
                            {p.stock < 10 && <span className="ml-1 text-xs text-red-500">Low</span>}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleEditProduct(p)}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(p._id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <SellerOrdersTable orders={orders} refetch={refetch} />
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Per Day */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Sales Per Day</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data?.salesPerDay || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                    <Bar dataKey="sales" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Product Performance */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Product Performance</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data?.productPerformance || []} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="sold" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Units Sold" />
                    </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inventory Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Inventory Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((p) => (
                  <div key={p._id} className={`p-4 rounded-xl border ${p.stock < 10 ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
                    <p className="font-medium text-gray-800 text-sm truncate">{p.productName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Stock: <span className={`font-bold ${p.stock < 10 ? "text-red-600" : "text-gray-800"}`}>{p.stock}</span></span>
                      <span className="text-xs text-gray-500 capitalize">{p.category}</span>
                    </div>
                    {p.stock < 10 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle className="w-3 h-3" /> Low stock alert
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
};

export default SellerDashboardPage;
