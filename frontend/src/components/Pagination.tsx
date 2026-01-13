interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no pages
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      {/* Previous */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm font-medium cursor-pointer outline-none focus:outline-none border-r border-gray-300 ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 bg-white hover:bg-gray-50"
        }`}
      >
        Previous
      </button>

      {/* Pages */}
      <div className="flex items-center">
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-500 select-none border-r border-gray-300"
              >
                …
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`px-3 py-2 text-sm font-medium cursor-pointer outline-none focus:outline-none border-r border-gray-300 ${
                currentPage === pageNum
                  ? "text-primary font-semibold"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm font-medium cursor-pointer outline-none focus:outline-none ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 bg-white hover:bg-gray-50"
        }`}
      >
        Next
      </button>
    </div>
  );
}
