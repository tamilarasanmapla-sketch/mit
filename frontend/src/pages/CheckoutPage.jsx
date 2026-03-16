import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useGetCartQuery, useClearCartMutation } from "../slices/cartApi";
import { useCreateOrderMutation } from "../slices/orderApi";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
  MapPin,
  Phone,
  Globe,
  Building,
  Hash,
  CreditCard,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

const CheckoutPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    phoneNo: "",
    pinCode: "",
    country: "",
  });

  if (cartLoading) return <Loader />;

  const cart = cartData?.cart || { items: [] };
  const validCartItems = cart.items.filter((item) => item.product);

  if (validCartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto mt-12">
        <ShoppingBag className="size-16 text-blue-100 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center">
          You cannot proceed to checkout with an empty cart.
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-3 px-8 rounded-2xl shadow-xl shadow-blue-200"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const itemsPrice = validCartItems.reduce(
    (acc, item) => acc + (item.product.discountedPrice || item.product.price) * item.quantity,
    0,
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 25;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const { address, city, state, phoneNo, pinCode, country } = shippingInfo;
    if (!address || !city || !state || !phoneNo || !pinCode || !country) {
      return toast.error("Please fill all shipping fields");
    }

    try {
      const orderData = {
        shippingInfo,
        orderItems: validCartItems.map((item) => ({
          productName: item.product.productName,
          price: item.product.discountedPrice || item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || "",
          product: item.product._id,
          seller: item.product.seller,
        })),
        paymentInfo: {
          id: "COD_" + Date.now(),
          status: "succeeded",
        },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await createOrder(orderData).unwrap();

      try {
        await clearCart().unwrap();
      } catch (clearError) {
        console.error("Cart clearing failed:", clearError);
        toast.warn("Order placed but cart clearing failed. Please refresh.");
      }

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        to="/cart"
        className="inline-flex items-center text-gray-400 hover:text-blue-600 font-bold mb-10 transition-colors group"
      >
        <ArrowLeft className="size-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Shipping Form */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Shipping Details
          </h1>
          <p className="text-gray-500 mb-10">
            Please enter your accurate shipping information to avoid delivery
            issues.
          </p>

          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    name="address"
                    type="text"
                    required
                    placeholder="123 Main St, Apt 4"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  City
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    name="city"
                    type="text"
                    required
                    placeholder="New York"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    name="phoneNo"
                    type="tel"
                    required
                    placeholder="+1 234 567 890"
                    value={shippingInfo.phoneNo}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  State
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    name="state"
                    type="text"
                    required
                    placeholder="New York"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Pin Code
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    name="pinCode"
                    type="text"
                    required
                    placeholder="10001"
                    value={shippingInfo.pinCode}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-3.5 text-gray-400 size-5" />
                  <input
                    name="country"
                    type="text"
                    required
                    placeholder="USA"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="size-6 mr-3 text-blue-600" /> Payment
                Method
              </h3>
              <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-600 p-2 rounded-xl mr-4 shadow-lg shadow-blue-200">
                    <Hash className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900">Cash on Delivery</p>
                    <p className="text-blue-500 text-xs font-medium">
                      Pay when your product arrives
                    </p>
                  </div>
                </div>
                <div className="size-6 rounded-full border-4 border-blue-600 bg-white"></div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-50 sticky top-32">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 border-b border-gray-50 pb-6">
              Summary
            </h2>

            <div className="space-y-5 mb-8">
              {validCartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center group"
                >
                  <div className="flex items-center">
                    <div className="size-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-50 flex items-center justify-center p-1.5 mr-4 group-hover:scale-105 transition-transform">
                      <img
                        src={item.product.images?.[0]?.url || ""}
                        alt=""
                        className="size-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight mb-1">
                        {item.product.productName}
                      </p>
                      <p className="text-xs font-bold text-gray-400 capitalize">
                        {item.product.category} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${((item.product.discountedPrice || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50 mb-10">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">
                  ${itemsPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span
                  className={
                    shippingPrice === 0
                      ? "text-green-600 font-bold"
                      : "text-gray-900 font-bold"
                  }
                >
                  {shippingPrice === 0
                    ? "Free"
                    : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Tax (GST 5%)</span>
                <span className="text-gray-900 font-bold">
                  ${taxPrice.toFixed(2)}
                </span>
              </div>
              <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center mt-4">
                <span className="text-xl font-extrabold text-gray-900">
                  Total
                </span>
                <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-2xl shadow-blue-100 disabled:opacity-50"
            >
              <span>{isCreating ? "Processing..." : "Place Order Now"}</span>
              <ShieldCheck className="size-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
