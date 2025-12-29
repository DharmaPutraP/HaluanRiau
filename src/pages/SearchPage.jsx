import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tag from "../components/Tag";
import { fetchSearchResults } from "../services/api";

function SearchPage() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const articlesPerPage = 10;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchSearchResults(
          query,
          currentPage,
          articlesPerPage,
          filterStartDate || null,
          filterEndDate || null
        );

        const data = response.articles || response;
        const pagination = response.pagination;

        setArticles(data);

        if (pagination?.totalPages) {
          setTotalArticles(
            pagination.totalItems || pagination.totalPages * articlesPerPage
          );
        }
      } catch (error) {
        console.error("Error loading search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      loadData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [query, currentPage, filterStartDate, filterEndDate]);

  const handleSearch = () => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 4) endPage = 6;
      if (currentPage >= totalPages - 3) startPage = totalPages - 5;

      if (startPage > 2) pages.push("...");
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="bg-white px-3 sm:px-5 md:px-10 py-12 sm:py-16 mt-2 text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Mencari...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full px-2 sm:px-4">
      <div className="bg-white px-3 sm:px-5 md:px-10 py-4 sm:py-6">
        {/* Header with Search Query */}
        <div className="mb-4 sm:mb-6 pb-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b-4 border-primary">
          {/* Title */}
          <div className="flex items-center gap-2 md:gap-3 pb-2 w-fit flex-wrap">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold break-words">
              HASIL PENCARIAN: "{decodeURIComponent(query)}"
            </h1>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            {(filterStartDate || filterEndDate) && (
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 bg-gray-500 text-white rounded text-xs sm:text-sm"
              >
                RESET
              </button>
            )}

            <button
              onClick={handleSearch}
              disabled={!startDate && !endDate}
              className={`px-4 py-2 rounded text-xs sm:text-sm font-semibold ${
                startDate || endDate
                  ? "bg-[#EE4339] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              CARI
            </button>

            <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                className="outline-none text-xs sm:text-sm"
              />
              <span>-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
                min={startDate || undefined}
                className="outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
              Tidak Ada Hasil
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
              Tidak ditemukan artikel yang sesuai dengan pencarian Anda
            </p>
            <button
              onClick={() => navigate.push("/")}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-[#EE4339] text-white rounded hover:bg-[#d63330] transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {articles.map((article, index) => {
              // Check if this is a galeri item
              const isGaleriItem = article.tag === "Galeri";
              const baseRoute = isGaleriItem ? "/galeri" : "/article";

              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(
                      `${baseRoute}/${article.id}/${article.url || article.id}`
                    )
                  }
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-3 md:p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition rounded"
                >
                  {/* Left: Content */}
                  <div className="md:col-span-9 flex flex-col justify-between order-2 md:order-1">
                    {/* Tag */}
                    <div className="mb-2">
                      <Tag judul={article.tag} className="text-xs" />
                    </div>

                    {/* Title */}
                    <h2 className="text-sm sm:text-base md:text-lg font-bold mb-2 hover:text-[#EE4339] transition leading-tight">
                      {article.judul}
                    </h2>

                    {/* Description - Hide on mobile */}
                    <p className="hidden md:block text-sm text-gray-700 mb-3 line-clamp-3 leading-relaxed text-justify">
                      {article.description}
                    </p>

                    {/* Date Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{article.tanggal}</span>
                      <span>|</span>
                      <span className="hidden sm:inline">
                        {article.lastUpdated}
                      </span>
                    </div>
                  </div>

                  {/* Right: Image */}
                  <div className="md:col-span-3 order-1 md:order-2">
                    <div className="w-full h-40 sm:h-32 md:h-auto md:aspect-video bg-blue-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                      <img
                        src={article.gambar}
                        alt={article.judul}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/image.png";
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="text-xs sm:text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>

            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Prev
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={i} className="px-2 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm rounded ${
                      currentPage === page
                        ? "bg-[#EE4339] text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
