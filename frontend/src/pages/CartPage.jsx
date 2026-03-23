import React from "react";
import { Link } from "react-router-dom";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useAddToCartMutation,
} from "../slices/cartApi";
import Loader from "../components/Loader";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

const CartPage = () => {
  const { data, isLoading, isError } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCart] = useAddToCartMutation();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="text-red-500 text-center py-20 font-bold bg-white rounded-3xl border border-gray-100 shadow-sm">
        Failed to load cart. Please try logging in again.
      </div>
    );
  }

  const cart = data?.cart || { items: [] };
  const validCartItems = cart.items.filter((item) => item.product);

  const handleUpdateQuantity = async (
    productId,
    currentQuantity,
    sellerId,
    change,
  ) => {
    if (currentQuantity + change < 1) return;
    try {
      await updateCart({ productId, quantity: change, sellerId }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (productId, sellerId) => {
    try {
      await removeFromCart({ productId, sellerId }).unwrap();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return validCartItems.reduce(
      (acc, item) =>
        acc +
        (item.product?.discountedPrice || item.product?.price || 0) *
          item.quantity,
      0,
    );
  };

  if (!validCartItems || validCartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <ShoppingBag className="size-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven't added anything to your cart yet. Explore our
          latest products and find something you love!
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 flex items-center">
        <ShoppingBag className="mr-3 text-blue-600" /> Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {validCartItems.map((item) => (
            <div
              key={item.product?._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <div className="size-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                <img
                  src={
                    item.product?.images?.[0]?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={item.product?.productName}
                  className="size-full object-contain p-2"
                />
              </div>

              <div className="ml-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.product?.productName}
                    </h3>
                    <p className="text-blue-600 font-bold mt-1 text-xl">
                      $
                      {(
                        item.product?.discountedPrice || item.product?.price
                      )?.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product?._id, item.seller)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product?._id,
                          item.quantity,
                          item.seller,
                          -1,
                        )
                      }
                      className={`p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 ${item.quantity === 1 ? "cursor-not-allowed" : ""}`}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product?._id,
                          item.quantity,
                          item.seller,
                          1,
                        )
                      }
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <p className="text-gray-900 font-bold">
                    Total:{" "}
                    <span className="text-blue-600">
                      $
                      {(
                        (item.product?.discountedPrice ||
                          item.product?.price ||
                          0) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50 sticky top-32">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({validCartItems.length} items)</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-extrabold text-blue-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl shadow-blue-200"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="size-5" />
            </Link>

            <p className="text-center text-gray-400 text-xs mt-6">
              Secure Checkout • 256-bit SSL Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
