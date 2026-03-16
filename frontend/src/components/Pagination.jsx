import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Calculate visible page range
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const pages = [];
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push("...");
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-12 mb-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="size-5" />
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
          className={`size-10 rounded-xl font-semibold transition-all ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-gray-600 hover:bg-gray-100 border border-transparent disabled:cursor-default"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
};

export default Pagination;
