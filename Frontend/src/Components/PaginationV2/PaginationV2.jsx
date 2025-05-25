import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const PaginationV2 = ({ currentPage, totalPages, onPageChange, bgColorStyle }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Determine which page numbers to show
  let pagesToShow = [];
  if (totalPages <= maxVisiblePages) {
    pagesToShow = pageNumbers;
  } else {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    if (currentPage <= halfVisible + 1) {
      pagesToShow = [...pageNumbers.slice(0, maxVisiblePages - 1), '...', totalPages];
    } else if (currentPage >= totalPages - halfVisible) {
      pagesToShow = [1, '...', ...pageNumbers.slice(-maxVisiblePages + 1)];
    } else {
      pagesToShow = [
        1,
        '...',
        ...pageNumbers.slice(currentPage - 2, currentPage + 1),
        '...',
        totalPages,
      ];
    }
  }

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pagesToShow.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ease-in-out ${
                currentPage === page
                  ? `${bgColorStyle ? bgColorStyle : 'bg-blue-600'} text-white`
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default PaginationV2;

