import { usePaginationStore } from "../store/usePaginationStore";

const Pagination = () => {
  const { currentPage, totalPages, setPage } = usePaginationStore();

  if (totalPages <= 1) return null;

  const goPrev = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Prev Button */}
      <button
        onClick={goPrev}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;

        return (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`px-4 py-2 rounded-md ${
              page === currentPage
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={goNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
