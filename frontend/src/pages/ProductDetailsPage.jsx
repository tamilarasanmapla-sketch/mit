import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductDetailsQuery } from "../slices/productsApi";
import { useGetCartQuery, useAddToCartMutation } from "../slices/cartApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RefreshCw,
  Plus,
  Minus,
} from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = React.useState(1);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetProductDetailsQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  if (isLoading) return <Loader />;
  if (isError || !data?.product)
    return (
      <div className="text-red-500 text-center py-20 font-bold">
        Product not found
      </div>
    );

  const { product } = data;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      return toast.error("Please login to add to cart");
    }
    try {
      // Check stock with current cart items
      let currentCartQty = 0;
      if (cartData?.cart?.items) {
        const item = cartData.cart.items.find((i) => i.product?._id === product._id);
        if (item) currentCartQty = item.quantity;
      }
      
      if (currentCartQty + quantity > product.stock) {
        return toast.error(`You can only add ${product.stock - currentCartQty} more to cart`);
      }

      await addToCart({
        productId: product._id,
        quantity,
        sellerId: product.seller,
      }).unwrap();
      toast.success("Added to cart successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="size-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center">
            <img
              src={
                product.images?.[0]?.url || "https://via.placeholder.com/600"
              }
              alt={product.productName}
              className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mt-4 leading-tight">
              {product.productName}
            </h1>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center bg-yellow-400/10 px-3 py-1.5 rounded-xl">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm font-medium">
                ({product.numOfReviews || 0} reviews)
              </span>
            </div>
          </div>

          <div className="mb-8 font-bold text-gray-900">
            <p className="text-4xl">
              ${(product.discountedPrice || product.price).toFixed(2)}
            </p>
            {product.discountedPrice && (
              <p className="text-lg text-gray-500 line-through mt-2">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex items-center space-x-3">
              <div
                className={`size-3 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm font-bold ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} units)`
                  : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-700 font-bold uppercase text-xs tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500 hover:text-blue-600"
                  >
                    <Minus className="size-5" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500 hover:text-blue-600"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl shadow-blue-200 disabled:opacity-50 disabled:grayscale"
            >
              <ShoppingCart className="size-6" />
              <span>{isAdding ? "Adding..." : "Add to Shopping Cart"}</span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex flex-col items-center text-center space-y-2">
              <ShieldCheck className="text-blue-600 size-8" />
              <span className="text-xs font-bold text-gray-900">
                Original Product
              </span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="text-blue-600 size-8" />
              <span className="text-xs font-bold text-gray-900">
                Fast Delivery
              </span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RefreshCw className="text-blue-600 size-8" />
              <span className="text-xs font-bold text-gray-900">
                7 Days Return
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
