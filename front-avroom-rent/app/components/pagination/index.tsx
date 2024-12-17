import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const generatePageNumbers = () => {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    };
  
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
         Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <HiChevronLeft className="text-xl" />
        </button>
  
         Números de página */}
        <div className="flex gap-1">
          {generatePageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md ${
                page === currentPage
                  ? "bg-primaryColor text-white"
                  : "bg-white border hover:border-primaryColor"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
  
         Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <HiChevronRight className="text-xl" />
        </button>
      </div>
    );
  };  