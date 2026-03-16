import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <Link
        to={`/product/${product._id}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
          alt={product.productName}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <Link
          to={`/product/${product._id}`}
          className="text-gray-800 font-semibold text-lg line-clamp-1 hover:text-blue-600 transition-colors mb-2 block"
        >
          {product.productName}
        </Link>

        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${
                i < Math.floor(product.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              ${product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {product.discountedPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            <ShoppingCart className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
