import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Trước</span>
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            disabled={page === "..."}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              page === currentPage
                ? "bg-amber-600 text-white"
                : page === "..."
                ? "cursor-default bg-transparent text-gray-500"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight size={18} />
      </button>

      <span className="ml-4 text-sm text-gray-600 hidden sm:inline">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
