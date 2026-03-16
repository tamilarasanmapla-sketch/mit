import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApi";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  React.useEffect(() => {
    setPage(1);
  }, [keyword]);

  const { data, isLoading, isError, error } = useGetProductsQuery({
    page,
    keyword,
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-red-500 text-center py-20">
        {error?.data?.message || error?.message || "Something went wrong"}
      </div>
    );

  if (!data) return null;

  const totalPages = Math.ceil(data.filteredProductsCount / data.resPerPage);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-blue-600 pl-4">
        Latest Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {data?.products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {data?.products?.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No products found.
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default HomePage;
